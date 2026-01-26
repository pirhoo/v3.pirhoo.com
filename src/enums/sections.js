export const SectionId = Object.freeze({
  INTRODUCTION: 'introduction',
  INVESTIGATIONS: 'investigations',
  ACTIVITY: 'activity',
  OSS: 'oss',
  PROJECTS: 'projects'
})

export const SECTION_IDS = Object.freeze([
  SectionId.INTRODUCTION,
  SectionId.INVESTIGATIONS,
  SectionId.ACTIVITY,
  SectionId.OSS,
  SectionId.PROJECTS
])

export const SectionLabel = Object.freeze({
  [SectionId.INTRODUCTION]: 'Introduction',
  [SectionId.INVESTIGATIONS]: 'Investigations',
  [SectionId.ACTIVITY]: 'Activity',
  [SectionId.OSS]: 'Open Source',
  [SectionId.PROJECTS]: 'Projects'
})

export const SectionLabelShort = Object.freeze({
  [SectionId.INTRODUCTION]: 'Intro',
  [SectionId.INVESTIGATIONS]: 'Investigations',
  [SectionId.ACTIVITY]: 'Activity',
  [SectionId.OSS]: 'OSS',
  [SectionId.PROJECTS]: 'Projects'
})
