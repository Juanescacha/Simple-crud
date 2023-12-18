<script setup>
import { ref, reactive, computed, watch } from 'vue';

const names = reactive(['Emil, Hans', 'Mustermann, Max', 'Teach, Roman']);
const selected = ref('');
const prefix = ref('');
const first = ref('');
const last = ref('');

const filteredNames = computed(() =>
  names.filter((n) =>
    n.toLowerCase().startsWith(prefix.value.trim().toLowerCase())
  )
);

watch(selected, (name) => {
  [last.value, first.value] = name.split(', ');
});

function create() {
  if (hasValidInput()) {
    const fullName = `${last.value.trim()}, ${first.value.trim()}`;
    if (!names.includes(fullName)) {
      names.push(fullName);
      first.value = last.value = '';
    }
  }
}

function update() {
  const fullName = `${last.value.trim()}, ${first.value.trim()}`;
  if (hasValidInput() && selected.value && !names.includes(fullName)) {
    const i = names.indexOf(selected.value);
    names[i] = selected.value = fullName;
  }
}

function del() {
  if (selected.value) {
    const i = names.indexOf(selected.value);
    names.splice(i, 1);
    selected.value = first.value = last.value = '';
  }
}

function hasValidInput() {
  const validNameRegex = /^[a-zA-Z]+$/;
  const name = first.value.trim();
  const surname = last.value.trim();

  return validNameRegex.test(name) && validNameRegex.test(surname);
}
</script>

<template>
  <div>
    <input
      v-model="prefix"
      placeholder="Filter prefix"
      data-ui="filter"
    />
  </div>

  <select
    size="5"
    v-model="selected"
    data-ui="crud-user-list"
  >
    <option
      v-for="name in filteredNames"
      :key="name"
      data-ui="userList-item"
    >
      {{ name }}
    </option>
  </select>

  <label
    >Name:
    <input
      v-model="first"
      data-ui="name"
  /></label>
  <label
    >Surname:
    <input
      v-model="last"
      data-ui="surname"
  /></label>

  <div class="buttons">
    <button
      @click="create"
      data-ui="create"
    >
      Create
    </button>
    <button
      @click="update"
      data-ui="update"
    >
      Update
    </button>
    <button
      @click="del"
      data-ui="delete"
    >
      Delete
    </button>
  </div>
</template>

<style>
* {
  font-size: inherit;
}

input {
  display: block;
  margin-bottom: 10px;
}

select {
  float: left;
  margin: 0 1em 1em 0;
  width: 14em;
}

.buttons {
  clear: both;
}

button + button {
  margin-left: 5px;
}
</style>
