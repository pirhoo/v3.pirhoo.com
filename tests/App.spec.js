import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '@/components/App.vue'

// Mock the child components to avoid complex setup
vi.mock('@/components/Introduction.vue', () => ({
  default: { template: '<div class="mock-introduction">Introduction</div>' }
}))
vi.mock('@/components/Activity.vue', () => ({
  default: { template: '<div class="mock-activity">Activity</div>' }
}))
vi.mock('@/components/Investigations.vue', () => ({
  default: { template: '<div class="mock-investigations">Investigations</div>' }
}))
vi.mock('@/components/Projects.vue', () => ({
  default: { template: '<div class="mock-projects">Projects</div>' }
}))

describe('App', () => {
  it('renders without crashing', () => {
    const wrapper = mount(App)
    expect(wrapper.exists()).toBe(true)
  })

  it('contains all main sections', () => {
    const wrapper = mount(App)
    expect(wrapper.find('.app').exists()).toBe(true)
    expect(wrapper.find('.mock-introduction').exists()).toBe(true)
    expect(wrapper.find('.mock-activity').exists()).toBe(true)
    expect(wrapper.find('.mock-investigations').exists()).toBe(true)
    expect(wrapper.find('.mock-projects').exists()).toBe(true)
  })
})
