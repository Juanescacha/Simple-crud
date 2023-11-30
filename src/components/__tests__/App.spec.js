import { mount } from '@vue/test-utils';
import App from '@/App.vue';
import { beforeEach, describe, expect, it } from 'vitest';

describe('App', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(App);
  });

  // it("initializes with correct elements", () => {
  // 	expect(wrapper.vm.names).toEqual([
  // 		"Emil, Hans",
  // 		"Mustermann, Max",
  // 		"Teach, Roman",
  // 	])
  // 	expect(wrapper.vm.selected).toBe("")
  // 	expect(wrapper.vm.prefix).toBe("")
  // 	expect(wrapper.vm.first).toBe("")
  // 	expect(wrapper.vm.last).toBe("")
  // })

  // it("filters names correctly", async () => {
  // 	await wrapper.setData({ prefix: "Emil" })
  // 	expect(wrapper.vm.filteredNames).toEqual(["Emil, Hans"])
  // })

  // it("updates first and last on selected change", async () => {
  // 	await wrapper.setData({ selected: "Emil, Hans" })
  // 	expect(wrapper.vm.first).toBe("Hans")
  // 	expect(wrapper.vm.last).toBe("Emil")
  // })

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

  it('cleans fist and last inputs after creating a name', () => {
    const name = wrapper.find('#name');
    const surname = wrapper.find('#surname');

    name.setValue('John');
    surname.setValue('Doe');
    wrapper.vm.create();

    expect(wrapper.vm.first).toBe('');
    expect(wrapper.vm.last).toBe('');
  });

  it("doesn't clean fist and last inputs after failing the name creation", () => {
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

  // it("updates an existing name correctly", async () => {
  // 	await wrapper.setData({
  // 		selected: "Emil, Hans",
  // 		first: "John",
  // 		last: "Doe",
  // 	})
  // 	wrapper.vm.update()
  // 	expect(wrapper.vm.names).toContain("Doe, John")
  // 	expect(wrapper.vm.names).not.toContain("Emil, Hans")
  // })
});
