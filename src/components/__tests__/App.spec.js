import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '@/App.vue';

/**
 * FEEDBACK:
 * Add more describes
 * Add selectors that may not change in the future. Example: data-ui
 * De-estructuring of wrapper.vm
 * Organize test in sanity-check, happy path, edge cases (Maybe with comments and describes)
 * Descriptive names for test (test-naming conventions)
 * Add messages to expects (second parameter)
 * 
 * TODO:
 * Modify the code to improve it
 */

describe('App', () => {
  let wrapper;

  beforeEach(async () => {
    wrapper = mount(App);
  });
  afterEach(() => wrapper.unmount());

  it('filters names correctly', async () => {
    const filter = wrapper.find('#filter');
    await filter.setValue('Emil');

    expect(wrapper.vm.filteredNames).toEqual(['Emil, Hans']);
  });

  it('deletes a name correctly', async () => {
    const select = wrapper.find('select');
    const deleteButton = wrapper.find('#delete');

    expect(wrapper.findAll('option').length).toBe(3);

    await select.setValue('Emil, Hans');
    await deleteButton.trigger('click');

    expect(wrapper.findAll('option').length).toBe(2);

    expect(wrapper.vm.names).not.toContain('Emil, Hans');
    expect(wrapper.html()).not.toContain('Emil, Hans');
  });

  it('updates a name correctly', async () => {
    const select = wrapper.find('select');
    const name = wrapper.find('#name');
    const surname = wrapper.find('#surname');
    const update = wrapper.find('#update');

    await select.setValue('Mustermann, Max');
    await name.setValue('Juan');
    await surname.setValue('Perez');
    await update.trigger('click');

    expect(wrapper.findAll('option')[1].text()).toBe('Perez, Juan');
    expect(wrapper.vm.names).toContain('Perez, Juan');
    expect(wrapper.vm.names).not.toContain('Mustermann, Max');
  });

  it('creates a new name correctly', () => {
    wrapper.find('#name').setValue('John');
    wrapper.find('#surname').setValue('Doe');
    wrapper.vm.create();
    expect(wrapper.vm.names).toContain('Doe, John');
  });

  it('creates a new name correctly even when is not alphabetical', () => {
    const name = wrapper.find('#name');
    const surname = wrapper.find('#surname');

    name.setValue(' John ');
    surname.setValue(' Doe');
    wrapper.vm.create();
    expect(wrapper.vm.names).toContain(' Doe,  John ');

    name.setValue('J#0n');
    surname.setValue('D@3-');
    wrapper.vm.create();
    expect(wrapper.vm.names).toContain('D@3-, J#0n');
  });

  it('does not create a new name if it already exists', () => {
    let numOfHans = wrapper.vm.names.filter(
      (name) => name === 'Emil, Hans'
    ).length;
    expect(numOfHans).toBe(1);

    wrapper.find('#name').setValue('Hans');
    wrapper.find('#surname').setValue('Emil');
    wrapper.vm.create();

    numOfHans = wrapper.vm.names.filter((name) => name === 'Emil, Hans').length;
    expect(numOfHans).toBe(1);
  });

  it('cleans first and last inputs after creating a name', async () => {
    const name = wrapper.find('#name');
    const surname = wrapper.find('#surname');

    name.setValue('John');
    surname.setValue('Doe');
    wrapper.vm.create();

    await wrapper.vm.$nextTick()
    expect(name.element.value).toBe('');
    expect(wrapper.vm.last).toBe('');
  });

  it("doesn't clean first and last inputs after failing the name creation", () => {
    const name = wrapper.find('#name');
    const surname = wrapper.find('#surname');

    name.setValue('Hans');
    surname.setValue('Emil');
    wrapper.vm.create();

    expect(wrapper.vm.first).toBe('Hans');
    expect(wrapper.vm.last).toBe('Emil');
  });

  it('correctly validates all input', () => {
    expect(wrapper.vm.hasValidInput()).toBeFalsy();

    wrapper.vm.first = '';
    wrapper.vm.last = 'Doe';
    expect(wrapper.vm.hasValidInput()).toBeFalsy();

    wrapper.vm.first = 'John';
    wrapper.vm.last = '';
    expect(wrapper.vm.hasValidInput()).toBeFalsy();

    wrapper.vm.first = ' ';
    wrapper.vm.last = '        ';
    expect(wrapper.vm.hasValidInput()).toBeFalsy();

    wrapper.vm.first = 'John';
    wrapper.vm.last = 'Doe ';
    expect(wrapper.vm.hasValidInput()).toBeTruthy();
  });

  it('throws an error on the input validation if first or last are not strings', () => {
    wrapper.vm.first = null;
    expect(() => wrapper.vm.hasValidInput()).toThrowError();

    wrapper.vm.first = 1;
    expect(() => wrapper.vm.hasValidInput()).toThrowError();

    wrapper.vm.first = 'John';
    wrapper.vm.last = {};
    expect(() => wrapper.vm.hasValidInput()).toThrowError();
  });
});
