import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '@/App.vue';

/**
 * FEEDBACK:
 * Organize test in sanity-check, happy path, edge cases (Maybe with comments and describes)
 * Add messages to expects (second parameter)
 */

describe('App', () => {
  let wrapper;

  beforeEach(async () => {
    wrapper = mount(App);
  });
  afterEach(() => wrapper.unmount());

  // sanity check
  it('should exist', () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should have names list initialized', () => {
    expect(wrapper.vm.names).toEqual([
      'Emil, Hans',
      'Mustermann, Max',
      'Teach, Roman',
    ]);
  });

  describe('when filtering a name', () => {
    // sanity check
    it('should exist the filter input field', () => {
      const xd = wrapper.find('[data-ui="filter"]');
      expect(xd.exists()).toBeTruthy();
    });

    it('should show matching filter name', async () => {
      const filterInput = wrapper.find('[data-ui="filter"]');
      await filterInput.setValue('Emil');
      const namesList = wrapper.findAll('[data-ui="userList-item"]');
      const isFound = namesList.some((e) => e.text() === 'Emil, Hans');
      expect(isFound).toBeTruthy();
    });

    it('should show nothing if nothing found', async () => {
      const filterInput = wrapper.find('[data-ui="filter"]');
      await filterInput.setValue('Alberto');
      const namesList = wrapper.findAll('[data-ui="userList-item"]');
      expect(namesList).toEqual([]);
    });
  });

  describe('when creating a new name', () => {
    // sanity check
    it('should exist the create button', () => {
      const createButton = wrapper.find('[data-ui="create"]');
      expect(createButton.exists()).toBeTruthy();
    });
    it('should show the name in the names list', async () => {
      const nameInput = wrapper.find('[data-ui="name"]');
      const surnameInput = wrapper.find('[data-ui="surname"]');
      const createButton = wrapper.find('[data-ui="create"]');
      nameInput.setValue('John');
      surnameInput.setValue('Doe');
      await createButton.trigger('click');
      const namesList = wrapper.findAll('[data-ui="userList-item"]');
      const isFound = namesList.some((e) => e.text() === 'Doe, John');
      expect(isFound).toBeTruthy();
    });

    it('should create the name even if its entered with spaces and start and end', async () => {
      const nameInput = wrapper.find('[data-ui="name"]');
      const surnameInput = wrapper.find('[data-ui="surname"]');
      const createButton = wrapper.find('[data-ui="create"]');
      nameInput.setValue('    John    ');
      surnameInput.setValue('    Doe    ');
      await createButton.trigger('click');
      const namesList = wrapper.findAll('[data-ui="userList-item"]');
      const isFound = namesList.some((name) => name.text() === 'Doe, John');
      expect(isFound).toBeTruthy();
    });

    it('should not create the name when it contains numbers or charater', async () => {
      const nameInput = wrapper.find('[data-ui="name"]');
      const surnameInput = wrapper.find('[data-ui="surname"]');
      const createButton = wrapper.find('[data-ui="create"]');
      nameInput.setValue('J#0n');
      surnameInput.setValue('D@3-');
      await createButton.trigger('click');
      const namesList = wrapper.findAll('[data-ui="userList-item"]');
      const isFound = namesList.some((name) => name.text() === 'D@3-, J#0n');
      expect(isFound).toBeFalsy();
    });

    it('should not create a new name if it exist already', async () => {
      const nameInput = wrapper.find('[data-ui="name"]');
      const surnameInput = wrapper.find('[data-ui="surname"]');
      const createButton = wrapper.find('[data-ui="create"]');
      let names = wrapper.findAll('[data-ui="userList-item"]');
      const numOfHans = (names) => {
        return names.filter((e) => e.text() === 'Emil, Hans').length;
      };
      expect(numOfHans(names)).toBe(1);
      nameInput.setValue('Hans');
      surnameInput.setValue('Emil');
      await createButton.trigger('click');
      names = wrapper.findAll('[data-ui="userList-item"]');
      expect(numOfHans(names)).toBe(1);
    });

    it('should clear name and surname inputs after a new creation', async () => {
      const nameInput = wrapper.find('[data-ui="name"]');
      const surnameInput = wrapper.find('[data-ui="surname"]');
      const createButton = wrapper.find('[data-ui="create"]');
      nameInput.setValue('John');
      surnameInput.setValue('Doe');
      await createButton.trigger('click');
      expect(nameInput.element.value).toBe('');
      expect(surnameInput.element.value).toBe('');
    });

    it('should not clear name and surname inputs after a failing name creation', async () => {
      const nameInput = wrapper.find('[data-ui="name"]');
      const surnameInput = wrapper.find('[data-ui="surname"]');
      const createButton = wrapper.find('[data-ui="create"]');
      nameInput.setValue('Hans');
      surnameInput.setValue('Emil');
      await createButton.trigger('click');
      expect(nameInput.element.value).toBe('Hans');
      expect(surnameInput.element.value).toBe('Emil');
    });
  });

  describe('when updating a name', () => {
    // sanity check
    it('should exist the update button', () => {
      const updateButton = wrapper.find('[data-ui="update"]');
      expect(updateButton.exists()).toBeTruthy();
    });

    it('should update a name', async () => {
      const selectInput = wrapper.find('[data-ui="crud-user-list"]');
      const nameInput = wrapper.find('[data-ui="name"]');
      const surnameInput = wrapper.find('[data-ui="surname"]');
      const updateButton = wrapper.find('[data-ui="update"]');
      await selectInput.setValue('Mustermann, Max');
      await nameInput.setValue('Juan');
      await surnameInput.setValue('Perez');
      await updateButton.trigger('click');
      const namesList = wrapper.findAll('[data-ui="userList-item"]');
      let isFound = namesList.some((name) => name.text() === 'Perez, Juan');
      expect(isFound).toBeTruthy();
      isFound = namesList.some((name) => name.text() === 'Mustermann, Max');
      expect(isFound).toBeFalsy();
    });
  });

  describe('when deleting a name', () => {
    // sanity check
    it('should exist the delete button', () => {
      const deleteButton = wrapper.find('[data-ui="delete"]');
      expect(deleteButton.exists()).toBeTruthy();
    });
    it('should delete a name', async () => {
      const selectInput = wrapper.find('[data-ui="crud-user-list"]');
      const deleteButton = wrapper.find('[data-ui="delete"]');
      let names = wrapper.findAll('[data-ui="userList-item"]');
      expect(names.length).toBe(3);
      await selectInput.setValue('Emil, Hans');
      await deleteButton.trigger('click');
      names = wrapper.findAll('[data-ui="userList-item"]');
      expect(names.length).toBe(2);
      let isFound = names.some((name) => name.text() === 'Emil, Hans');
      expect(isFound).toBeFalsy();
    });
  });

  describe('when the user input is validated', () => {
    // sanity check
    it('should exist the name and surname inputs', () => {
      const nameInput = wrapper.find('[data-ui="name"]');
      const surnameInput = wrapper.find('[data-ui="surname"]');
      expect(nameInput.exists()).toBeTruthy();
      expect(surnameInput.exists()).toBeTruthy();
    });

    it('should be falsy when both inputs are empty', () => {
      expect(wrapper.vm.hasValidInput()).toBeFalsy();
    });

    it('should be falsy when one of the two inputs are empty', () => {
      const { vm: componentInstance } = wrapper;
      componentInstance.first = '';
      componentInstance.last = 'Doe';
      expect(
        componentInstance.hasValidInput(),
        'should be falsy when the first input is empty'
      ).toBeFalsy();

      componentInstance.first = 'John';
      componentInstance.last = '';
      expect(
        componentInstance.hasValidInput(),
        'should be falsy when the  input is empty'
      ).toBeFalsy();
    });

    it('should be falsy when the inputs are just spaces', () => {
      const { vm: componentInstance } = wrapper;
      componentInstance.first = ' ';
      componentInstance.last = '        ';
      expect(componentInstance.hasValidInput()).toBeFalsy();
    });

    it('should be truthy when the inputs have characters different to spaces', () => {
      const { vm: componentInstance } = wrapper;
      componentInstance.first = 'John';
      componentInstance.last = 'Doe ';
      expect(componentInstance.hasValidInput()).toBeTruthy();
    });

    it('should throw an error on the input validation if first or last are not strings', () => {
      const { vm: componentInstance } = wrapper;
      componentInstance.first = null;
      expect(
        () => componentInstance.hasValidInput(),
        'throws error when an input is null'
      ).toThrowError();

      componentInstance.first = 1;
      expect(
        () => componentInstance.hasValidInput(),
        'throws error when an input is a type number'
      ).toThrowError();

      componentInstance.first = 'John';
      componentInstance.last = {};
      expect(
        () => componentInstance.hasValidInput(),
        'throws error when an input is an object'
      ).toThrowError();
    });
  });
});
