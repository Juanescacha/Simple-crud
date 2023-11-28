import { mount } from "@vue/test-utils"
import App from "@/App.vue"

describe("App", () => {
	let wrapper

	beforeEach(() => {
		wrapper = mount(App)
	})

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

	// it("creates a new name correctly", async () => {
	// 	await wrapper.setData({ first: "John", last: "Doe" })
	// 	wrapper.vm.create()
	// 	expect(wrapper.vm.names).toContain("Doe, John")
	// })

	// it("does not create a new name if it already exists", async () => {
	// 	await wrapper.setData({ first: "Hans", last: "Emil" })
	// 	wrapper.vm.create()
	// 	expect(wrapper.vm.names).not.toContain("Emil, Hans")
	// })

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
})
