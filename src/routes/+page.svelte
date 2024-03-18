<script lang="ts">
    import Bin from "$lib/components/icons/Bin.svelte";
    import { Jellyfish } from "svelte-loading-spinners";
    type Todo = {
        text: string;
        done: boolean;
    };
    type Filters = "all" | "active" | "completed";

    let todos = $state<Todo[]>([]);
    let filter = $state<Filters>("all");
    let filteredTodos = $derived(filterTodos());
    let isLoadingTodos = $state<boolean>(true);
    let isDeleting = $state<boolean>(false);

    $effect(() => {
        console.log("Getting todos");
        const savedTodos = localStorage.getItem("todos");

        if (savedTodos) {
            todos = JSON.parse(savedTodos);
        }

        isLoadingTodos = false;
    });

    $effect(() => {
        todos.forEach((todo) => {
            todo.text;
            todo.done;
        });

        console.log("Saving todos " + JSON.stringify(todos));
        localStorage.setItem("todos", JSON.stringify(todos));
    });

    function addTodo(event: KeyboardEvent) {
        if (event.key !== "Enter") return;

        const todoEl = event.target as HTMLInputElement;
        const text = todoEl.value;
        const done = false;

        todos.unshift({ text, done });
        todoEl.value = "";
    }

    function setFilter(newFilter: Filters) {
        filter = newFilter;
    }

    function filterTodos() {
        switch (filter) {
            case "all":
                return todos;
            case "active":
                return todos.filter((todo) => !todo.done);
            case "completed":
                return todos.filter((todo) => todo.done);
        }
    }
</script>

<div
    class="todos bg-gray-800 text-blue-100 min-h-screen flex justify-center items-center"
>
    <div class="todo max-w-md flex flex-col gap-1">
        {#if isLoadingTodos}
            <Jellyfish size="60" unit="px" />
        {:else}
            <input
                class="p-3 border-2 border-gray-600 rounded-md"
                onkeydown={addTodo}
                placeholder="Add new todo..."
                type="text"
            />
            <div class="grid grid-cols-7 gap-2 my-1">
                <button
                    class="col-span-2 py-1 px-3 border-2 border-gray-600 rounded-md duration-150"
                    class:bg-teal-800={filter === "all"}
                    onclick={() => setFilter("all")}>All</button
                >
                <button
                    class="col-span-2 py-1 px-3 border-2 border-gray-600 rounded-md duration-150"
                    class:bg-teal-800={filter === "active"}
                    onclick={() => setFilter("active")}>Active</button
                >
                <button
                    class="col-span-2 py-1 px-3 border-2 border-gray-600 rounded-md duration-150"
                    class:bg-teal-800={filter === "completed"}
                    onclick={() => setFilter("completed")}>Completed</button
                >
                <button
                    class="col-span-1 py-1 px-3 border-2 border-red-800 rounded-md duration-150"
                    class:bg-red-900={isDeleting}
                    onclick={() => (isDeleting = !isDeleting)}
                    ><Bin class="mx-auto text-red-600" /></button
                >
            </div>

            {#each filteredTodos as todo, i}
                <div
                    class:opacity-40={todo.done}
                    class="bg-gray-700 flex p-3 gap-3 rounded-md duration-200"
                >
                    <input
                        bind:value={todo.text}
                        disabled={todo.done}
                        type="text"
                        name=""
                        id=""
                    />
                    <input
                        bind:checked={todo.done}
                        type="checkbox"
                        name=""
                        id=""
                    />
                    <button
                        class="border-2 border-red-800 rounded-md w-12 overflow-hidden duration-150"
                        class:w-0={!isDeleting}
                        class:border-0={!isDeleting}
                        onclick={() => todos = todos.filter(t => t !== todo)}
                        ><Bin class="mx-auto text-red-600" /></button
                    >
                </div>
            {/each}
        {/if}
    </div>
</div>
