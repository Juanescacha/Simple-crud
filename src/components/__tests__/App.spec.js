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

  it('sanity-check', () => {
    expect(wrapper.vm).toBeTruthy();
  });

  describe('when filtering a name', () => {
    it('should filter names', async () => {
      const filterInput = wrapper.find('[data-ui="filter"]');
      await filterInput.setValue('Emil');
      const filteredNames = wrapper.findAll('[data-ui="userList-item"]');
      const isFound = filteredNames.some(
        (name) => name.text() === 'Emil, Hans'
      );
      expect(isFound).toBeTruthy();
    });

    it('should show nothing if nothing found', async () => {
      const filterInput = wrapper.find('[data-ui="filter"]');
      await filterInput.setValue('Alberto');
      const filteredNames = wrapper.findAll('[data-ui="userList-item"]');
      expect(filteredNames).toEqual([]);
    });
  });

  describe('when creating a new name', () => {
    it('should show the name in the names list', async () => {
      const nameInput = wrapper.find('[data-ui="name"]');
      const surnameInput = wrapper.find('[data-ui="surname"]');
      const createButton = wrapper.find('[data-ui="create"]');
      nameInput.setValue('John');
      surnameInput.setValue('Doe');
      await createButton.trigger('click');
      const filteredNames = wrapper.findAll('[data-ui="userList-item"]');
      const isFound = filteredNames.some((name) => name.text() === 'Doe, John');
      expect(isFound).toBeTruthy();
    });

    it('should create the name even if its entered with spaces and start and end', async () => {
      const name = wrapper.find('[data-ui="name"]');
      const surname = wrapper.find('[data-ui="surname"]');
      const createButton = wrapper.find('[data-ui="create"]');
      name.setValue('    John    ');
      surname.setValue('    Doe    ');
      await createButton.trigger('click');
      const filteredNames = wrapper.findAll('[data-ui="userList-item"]');
      const isFound = filteredNames.some((name) => name.text() === 'Doe, John');
      expect(isFound).toBeTruthy();
    });

    it('should not create the name when it contains numbers or charater', async () => {
      const name = wrapper.find('[data-ui="name"]');
      const surname = wrapper.find('[data-ui="surname"]');
      const createButton = wrapper.find('[data-ui="create"]');
      name.setValue('J#0n');
      surname.setValue('D@3-');
      await createButton.trigger('click');
      const filteredNames = wrapper.findAll('[data-ui="userList-item"]');
      const isFound = filteredNames.some(
        (name) => name.text() === 'D@3-, J#0n'
      );
      expect(isFound).not.toBeTruthy();
    });

    it('should not create a new name if it exist already', async () => {
      const nameInput = wrapper.find('[data-ui="name"]');
      const surnameInput = wrapper.find('[data-ui="surname"]');
      const button = wrapper.find('[data-ui="create"]');
      let names = wrapper.findAll('[data-ui="userList-item"]');
      const numOfHans = (names) => {
        return names.filter((e) => e.text() === 'Emil, Hans').length;
      };
      expect(numOfHans(names)).toBe(1);

      nameInput.setValue('Hans');
      surnameInput.setValue('Emil');
      await button.trigger('click');

      names = wrapper.findAll('[data-ui="userList-item"]');
      expect(numOfHans(names)).toBe(1);
      // ? nose si probar mejor el length de names unicamente
    });

    it('should clear name and surname inputs after a new creation', async () => {
      const nameInput = wrapper.find('[data-ui="name"]');
      const surnameInput = wrapper.find('[data-ui="surname"]');
      const create = wrapper.find('[data-ui="create"]');
      nameInput.setValue('John');
      surnameInput.setValue('Doe');
      await create.trigger('click');
      expect(nameInput.element.value).toBe('');
      expect(surnameInput.element.value).toBe('');
    });

    it('should not clear name and surname inputs after a failing name creation', async () => {
      const nameInput = wrapper.find('[data-ui="name"]');
      const surnameInput = wrapper.find('[data-ui="surname"]');
      const create = wrapper.find('[data-ui="create"]');
      nameInput.setValue('Hans');
      surnameInput.setValue('Emil');
      await create.trigger('click');
      expect(nameInput.element.value).toBe('Hans');
      expect(surnameInput.element.value).toBe('Emil');
    });
  });

  describe('when updating a name', () => {
    it('should update a name', async () => {
      const selectInput = wrapper.find('[data-ui="crud-user-list"]');
      const nameInput = wrapper.find('[data-ui="name"]');
      const surnameInput = wrapper.find('[data-ui="surname"]');
      const update = wrapper.find('[data-ui="update"]');
      await selectInput.setValue('Mustermann, Max');
      await nameInput.setValue('Juan');
      await surnameInput.setValue('Perez');
      await update.trigger('click');
      const filteredNames = wrapper.findAll('[data-ui="userList-item"]');
      const isFound = filteredNames.some(
        (name) => name.text() === 'Perez, Juan'
      );
      expect(isFound).toBeTruthy();
      const isNotFound = filteredNames.some(
        (name) => name.text() === 'Mustermann, Max'
      );
      expect(isNotFound).toBeFalsy();
    });
  });

  describe('when deleting a name', () => {
    it('should delete a name', async () => {
      const selectInput = wrapper.find('[data-ui="crud-user-list"]');
      const deleteButton = wrapper.find('[data-ui="delete"]');
      let names = wrapper.findAll('[data-ui="userList-item"]');
      expect(names.length).toBe(3);
      await selectInput.setValue('Emil, Hans');
      await deleteButton.trigger('click');
      names = wrapper.findAll('[data-ui="userList-item"]');
      expect(names.length).toBe(2);
      const isNotFound = names.some((name) => name.text() === 'Emil, Hans');
      expect(isNotFound).toBeFalsy();
    });
  });

  describe('when the user input is validated', () => {
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
