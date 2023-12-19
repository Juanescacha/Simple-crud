import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '@/App.vue';

describe('App', () => {
  let wrapper;

  const nameInput = () => wrapper.find('[data-ui="name"]');
  const surnameInput = () => wrapper.find('[data-ui="surname"]');
  const selectInput = () => wrapper.find('[data-ui="crud-user-list"]');
  const namesList = () => wrapper.findAll('[data-ui="userList-item"]');
  const filterInput = () => wrapper.find('[data-ui="filter"]');
  const createButton = () => wrapper.find('[data-ui="create"]');
  const updateButton = () => wrapper.find('[data-ui="update"]');
  const deleteButton = () => wrapper.find('[data-ui="delete"]');

  const timesFound = (list, name) =>
    list.filter((e) => e.text() === name).length;

  beforeEach(async () => {
    wrapper = mount(App);
  });

  afterEach(() => wrapper.unmount());

  // sanity check
  it('should exist', () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should have the default names list initialized', () => {
    const names = namesList().map((e) => e.text());
    expect(names).toEqual(['Emil, Hans', 'Mustermann, Max', 'Teach, Roman']);
  });

  describe('when filtering a name', () => {
    // sanity check
    it('should exist the filter input field', () => {
      expect(filterInput().exists()).toBeTruthy();
    });
    // happy path
    it('should show matching filter name', async () => {
      await filterInput().setValue('Emil');
      expect(timesFound(namesList(), 'Emil, Hans')).toBe(1);
      expect(namesList().length).toBe(1);
    });

    it('should show nothing if nothing found', async () => {
      await filterInput().setValue('Alberto');
      expect(namesList()).toEqual([]);
      expect(namesList().length).toBe(0);
    });
    // edge cases
    it('should show all names if filter is empty', async () => {
      await filterInput().setValue('');
      const names = namesList().map((e) => e.text());
      expect(names).toEqual(['Emil, Hans', 'Mustermann, Max', 'Teach, Roman']);
    });

    it('should show all names if filter is just spaces', async () => {
      await filterInput().setValue('   ');
      const names = namesList().map((e) => e.text());
      expect(names).toEqual(['Emil, Hans', 'Mustermann, Max', 'Teach, Roman']);
    });
  });

  describe('when creating a new name', () => {
    // sanity check
    it('should exist the create button', () => {
      expect(createButton().exists()).toBeTruthy();
    });
    // happy path
    it('should show the name in the names list', async () => {
      nameInput().setValue('John');
      surnameInput().setValue('Doe');
      await createButton().trigger('click');
      expect(timesFound(namesList(), 'Doe, John')).toBe(1);
    });

    it('should create the name even if its entered with spaces at start and end', async () => {
      nameInput().setValue('    John    ');
      surnameInput().setValue('    Doe    ');
      await createButton().trigger('click');
      expect(timesFound(namesList(), 'Doe, John')).toBe(1);
    });

    it('should clear name and surname inputs after a new creation', async () => {
      nameInput().setValue('John');
      surnameInput().setValue('Doe');
      await createButton().trigger('click');
      expect(nameInput().element.value).toBe('');
      expect(surnameInput().element.value).toBe('');
    });
    // error cases
    it('should not create the name if its empty', async () => {
      nameInput().setValue('');
      surnameInput().setValue('');
      await createButton().trigger('click');
      expect(namesList().length).toBe(3);
      expect(namesList().length).toBe(3);
    });

    it('should not create the name if its just spaces', async () => {
      nameInput().setValue('    ');
      surnameInput().setValue('    ');
      await createButton().trigger('click');
      expect(namesList().length).toBe(3);
      expect(namesList().length).toBe(3);
    });

    it('should not create the name when it contains numbers or charater', async () => {
      nameInput().setValue('J#0n');
      surnameInput().setValue('D@3-');
      expect(namesList().length).toBe(3);
      await createButton().trigger('click');
      expect(namesList().length).toBe(3);
      expect(timesFound(namesList(), 'D@3-, J#0n')).toBe(0);
    });

    it('should not create the name when it contains spaces', async () => {
      nameInput().setValue('John Doe');
      surnameInput().setValue('Sullivan');
      expect(namesList().length).toBe(3);
      await createButton().trigger('click');
      expect(namesList().length).toBe(3);
      expect(timesFound(namesList(), 'Sullivan, John Doe')).toBe(0);
    });

    it('should not create the name if it exist already', async () => {
      expect(timesFound(namesList(), 'Emil, Hans')).toBe(1);
      nameInput().setValue('Hans');
      surnameInput().setValue('Emil');
      await createButton().trigger('click');
      expect(timesFound(namesList(), 'Emil, Hans')).toBe(1);
    });

    it('should not clear name and surname inputs after a failing name creation', async () => {
      nameInput().setValue('Hans');
      surnameInput().setValue('Emil');
      await createButton().trigger('click');
      expect(nameInput().element.value).toBe('Hans');
      expect(surnameInput().element.value).toBe('Emil');
    });
  });

  describe('when updating a name', () => {
    // sanity check
    it('should exist the update button', () => {
      expect(updateButton().exists()).toBeTruthy();
    });
    // happy path
    it('should update a name', async () => {
      await selectInput().setValue('Mustermann, Max');
      await nameInput().setValue('Juan');
      await surnameInput().setValue('Perez');
      await updateButton().trigger('click');
      expect(timesFound(namesList(), 'Perez, Juan')).toBe(1);
      expect(timesFound(namesList(), 'Mustermann, Max')).toBe(0);
    });

    it('should update the name even if its entered with spaces at start and end', async () => {
      await selectInput().setValue('Mustermann, Max');
      await nameInput().setValue('   Juan   ');
      await surnameInput().setValue('   Perez   ');
      await updateButton().trigger('click');
      expect(timesFound(namesList(), 'Perez, Juan')).toBe(1);
    });
    // error cases
    it('should not update the name if its empty', async () => {
      await selectInput().setValue('Mustermann, Max');
      await nameInput().setValue('');
      await surnameInput().setValue('');
      await updateButton().trigger('click');
      expect(timesFound(namesList(), 'Mustermann, Max')).toBe(1);
    });

    it('should not update the name if nothing is selected', async () => {
      await updateButton().trigger('click');
      const names = namesList().map((e) => e.text());
      expect(names).toEqual(['Emil, Hans', 'Mustermann, Max', 'Teach, Roman']);
    });

    it('should not update the name if its just spaces', async () => {
      await selectInput().setValue('Mustermann, Max');
      await nameInput().setValue('    ');
      await surnameInput().setValue('    ');
      await updateButton().trigger('click');
      expect(timesFound(namesList(), 'Mustermann, Max')).toBe(1);
    });

    it('should not update the name when it contains numbers or charater', async () => {
      await selectInput().setValue('Mustermann, Max');
      await nameInput().setValue('J#0n');
      await surnameInput().setValue('D@3-');
      await updateButton().trigger('click');
      expect(timesFound(namesList(), 'Mustermann, Max')).toBe(1);
    });

    it('should not update the name when it contains spaces', async () => {
      await selectInput().setValue('Mustermann, Max');
      await nameInput().setValue('John Doe');
      await surnameInput().setValue('Sullivan');
      await updateButton().trigger('click');
      expect(timesFound(namesList(), 'Mustermann, Max')).toBe(1);
    });

    it('should not update the name if it exist already', async () => {
      await selectInput().setValue('Mustermann, Max');
      await nameInput().setValue('Hans');
      await surnameInput().setValue('Emil');
      await updateButton().trigger('click');
      expect(timesFound(namesList(), 'Mustermann, Max')).toBe(1);
    });
  });

  describe('when deleting a name', () => {
    // sanity check
    it('should exist the delete button', () => {
      expect(deleteButton().exists()).toBeTruthy();
    });
    // happy path
    it('should delete a name', async () => {
      expect(namesList().length).toBe(3);
      await selectInput().setValue('Emil, Hans');
      await deleteButton().trigger('click');
      expect(namesList().length).toBe(2);
      expect(timesFound(namesList(), 'Emil, Hans')).toBe(0);
    });
    // error cases
    it('should not delete a name if nothing is selected', async () => {
      await deleteButton().trigger('click');
      const names = namesList().map((e) => e.text());
      expect(names).toEqual(['Emil, Hans', 'Mustermann, Max', 'Teach, Roman']);
    });
  });

  describe('when the user input is validated', () => {
    // sanity check
    it('should exist the name and surname inputs', () => {
      expect(nameInput().exists()).toBeTruthy();
      expect(surnameInput().exists()).toBeTruthy();
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
