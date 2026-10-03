import { getPayload } from 'payload';
import config from '../src/payload.config';
import readline from 'readline';

function promptHidden(query: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const stdin = process.stdin as any;
    const oldRawMode = stdin.isRaw;

    process.stdout.write(query);

    if (stdin.setRawMode) {
      stdin.setRawMode(true);
    }

    let password = '';
    const onData = (chunk: Buffer) => {
      const char = chunk.toString();
      if (char === '\n' || char === '\r' || char === '\u0004') {
        if (stdin.setRawMode) stdin.setRawMode(oldRawMode || false);
        stdin.removeListener('data', onData);
        process.stdout.write('\n');
        rl.close();
        resolve(password);
      } else if (char === '\u0003') {
        // Ctrl+C
        if (stdin.setRawMode) stdin.setRawMode(oldRawMode || false);
        process.stdout.write('\nAborted.\n');
        process.exit(1);
      } else if (char === '\u0008' || char === '\x7f') {
        // Backspace
        if (password.length > 0) {
          password = password.slice(0, -1);
        }
      } else {
        password += char;
      }
    };

    stdin.on('data', onData);
  });
}

export async function resetAdminPassword() {
  console.log('\n==================================================');
  console.log('  GEMA LOCAL ADMIN PASSWORD RESET TOOL');
  console.log('==================================================');
  console.log('Target user: admin@gemasurabaya.local\n');

  let newPassword = process.env.NEW_ADMIN_PASSWORD;

  if (newPassword) {
    console.log('[Notice] Using NEW_ADMIN_PASSWORD from environment variable.');
    console.log('[Notice] Note: environment variables may leave traces in shell/process history.\n');
  } else {
    newPassword = await promptHidden('Enter new admin password: ');
    if (!newPassword || newPassword.length < 8) {
      console.error('\n❌ Password must be at least 8 characters long.');
      process.exit(1);
    }

    const confirmPassword = await promptHidden('Confirm new admin password: ');
    if (newPassword !== confirmPassword) {
      console.error('\n❌ Password mismatch. Aborted.');
      process.exit(1);
    }
  }

  const payload = await getPayload({ config });
  const email = 'admin@gemasurabaya.local';

  // Check if admin user exists
  const existingUsers = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    overrideAccess: true,
  });

  if (existingUsers.docs.length > 0) {
    const user = existingUsers.docs[0];
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        password: newPassword,
        role: 'admin',
      },
      overrideAccess: true,
    });
    console.log(`\n✓ Successfully updated password for admin user: ${email}`);
  } else {
    await payload.create({
      collection: 'users',
      data: {
        name: 'GEMA Admin',
        email,
        password: newPassword,
        role: 'admin',
      },
      overrideAccess: true,
    });
    console.log(`\n✓ Successfully created new admin user: ${email}`);
  }

  console.log('Local Admin password is now set and ready for use in Payload Admin.');
  console.log('==================================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  resetAdminPassword()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Password reset failed:', err.message || err);
      process.exit(1);
    });
}
