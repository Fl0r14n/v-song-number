import pluginVitest from '@vitest/eslint-plugin'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import { vueTsConfigs } from '@vue/eslint-config-typescript'
import oxlint from 'eslint-plugin-oxlint'
import pluginVue from 'eslint-plugin-vue'

export default [
  { files: ['**/*.{ts,mts,tsx,vue}'] },
  {
    ignores: [
      '.DS_Store',
      '**/node_modules/**',
      '**/coverage/**',
      '**/dist/**',
      '**/ios/**',
      '**/android/**',

      '.env.local',
      '.env.*.local',

      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',
      'pnpm-debug.log*',

      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',
      'pnpm-debug.log*',

      '.idea',
      '.vscode',
      '*.suo',
      '*.ntvs*',
      '*.njsproj',
      '*.sln',
      '*.sw?'
    ]
  },
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*']
  },
  oxlint.configs['flat/recommended'],
  skipFormatting,
  {
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      semi: ['error', 'never']
    }
  }
]
