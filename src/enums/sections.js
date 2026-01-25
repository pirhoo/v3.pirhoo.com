export const SectionId = Object.freeze({
  INTRODUCTION: 'introduction',
  INVESTIGATIONS: 'investigations',
  ACTIVITY: 'activity',
  PROJECTS: 'projects'
})

export const SECTION_IDS = Object.freeze([
  SectionId.INTRODUCTION,
  SectionId.INVESTIGATIONS,
  SectionId.ACTIVITY,
  SectionId.PROJECTS
])

export const SectionLabel = Object.freeze({
  [SectionId.INTRODUCTION]: 'Introduction',
  [SectionId.INVESTIGATIONS]: 'Investigations',
  [SectionId.ACTIVITY]: 'Activity',
  [SectionId.PROJECTS]: 'Projects'
})

export const SectionLabelShort = Object.freeze({
  [SectionId.INTRODUCTION]: 'Intro',
  [SectionId.INVESTIGATIONS]: 'Investigations',
  [SectionId.ACTIVITY]: 'Activity',
  [SectionId.PROJECTS]: 'Projects'
})
