import { suffixSpaceRegex } from '@/utils/regex';

export const eliminateSuffixSpace = str => str.replace(suffixSpaceRegex, '');