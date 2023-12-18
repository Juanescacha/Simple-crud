<script setup>
import { ref, reactive, computed, watch } from 'vue';

document.body.style.zoom = 2;

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
      class="w-56 mb-2"
      data-ui="filter"
    />
  </div>

  <select
    size="5"
    v-model="selected"
    class="mr-4"
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

  <div class="buttons mt-3">
    <button
      @click="create"
      class="bg-green-400 hover:bg-green-300 focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-slate-50 focus:outline-none"
      data-ui="create"
    >
      Create
    </button>
    <button
      @click="update"
      :disabled="!selected"
      class="bg-sky-400 hover:bg-sky-300 focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-400 focus:outline-none"
      data-ui="update"
    >
      Update
    </button>
    <button
      @click="del"
      :disabled="!selected"
      class="bg-red-400 hover:bg-red-300 focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-400 focus:outline-none"
      data-ui="delete"
    >
      Delete
    </button>
  </div>
</template>

<style>
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
  margin-left: 7px;
}
</style>
