import { audioManager } from '../src/lib/audioManager';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== GEMA AUDIO-001 DETERMINISTIC CODE & STATE QA ===\n');

// 1. AudioManager Volume Constants & Initial State
console.log('1. Checking AudioManager:');
console.log('   normalVolume:', audioManager.normalVolume, audioManager.normalVolume === 0.15 ? '✓ PASS (50% reduction from 0.30)' : '✗ FAIL');
console.log('   duckedVolume:', audioManager.duckedVolume, audioManager.duckedVolume === 0.05 ? '✓ PASS (preserved as potentially dead without runtime consumer)' : '✗ FAIL');

const state = audioManager.getState();
console.log('   initial state volume:', state.volume, state.volume === 0.15 ? '✓ PASS' : '✗ FAIL');

// 2. ChefPreview Component Audit
console.log('\n2. Checking ChefPreview.tsx:');
const chefPreviewPath = path.resolve(__dirname, '../src/components/home/ChefPreview.tsx');
const chefContent = fs.readFileSync(chefPreviewPath, 'utf8');

const hasConstant = chefContent.includes('const CHEF_VIDEO_VOLUME = 0.5;');
console.log('   Defines CHEF_VIDEO_VOLUME = 0.5:', hasConstant ? '✓ PASS' : '✗ FAIL');

const usesInActivation = chefContent.includes('video.volume = CHEF_VIDEO_VOLUME;');
console.log('   Uses CHEF_VIDEO_VOLUME in viewport activation:', usesInActivation ? '✓ PASS' : '✗ FAIL');

const occurrences = (chefContent.match(/video\.volume\s*=\s*CHEF_VIDEO_VOLUME;/g) || []).length;
console.log(`   Occurrences of video.volume = CHEF_VIDEO_VOLUME: ${occurrences} (expected: 2) ->`, occurrences === 2 ? '✓ PASS' : '✗ FAIL');

const hasOldVolume = chefContent.includes('video.volume = 1.0;') || chefContent.includes('video.volume = 1;');
console.log('   No legacy 1.0 volume writes remain:', !hasOldVolume ? '✓ PASS' : '✗ FAIL');

// 3. Check for double scaling
console.log('\n3. Checking for Double Scaling:');
const audioManagerPath = path.resolve(__dirname, '../src/lib/audioManager.ts');
const audioManagerContent = fs.readFileSync(audioManagerPath, 'utf8');
const hasDynamicScaling = audioManagerContent.includes('*= 0.5') || chefContent.includes('*= 0.5');
console.log('   Zero dynamic scaling (*= 0.5):', !hasDynamicScaling ? '✓ PASS' : '✗ FAIL');

if (
  audioManager.normalVolume === 0.15 &&
  hasConstant &&
  occurrences === 2 &&
  !hasOldVolume &&
  !hasDynamicScaling
) {
  console.log('\n✓ ALL DETERMINISTIC CODE & CONTRACT CHECKS PASSED.');
  process.exit(0);
} else {
  console.error('\n✗ SOME CHECKS FAILED.');
  process.exit(1);
}
