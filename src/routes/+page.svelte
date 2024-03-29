<script lang="ts">
    import Bin from "$lib/components/icons/Bin.svelte";
    import { Jellyfish } from "svelte-loading-spinners";
    import "$lib/styles/customCheckboxes.scss";
    import { send, receive } from "$lib/transitions/crossfade";

    type Todo = {
        id: string;
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
        const id = window.crypto.randomUUID();
        const text = todoEl.value;
        const done = false;

        todos.unshift({ id, text, done });
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
            <Jellyfish size="60" unit="px" color="white" />
        {:else}
            <h1 class="text-2xl font-bold text-center mb-4">Svelte 5 Todos</h1>
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

            {#if filteredTodos.length === 0}
                <p class="text-gray-600 text-center">There is no note</p>
            {/if}

            {#each filteredTodos as todo (todo.id)}
                <div
                    class:opacity-40={todo.done}
                    class="bg-gray-700 flex p-3 rounded-md duration-200 justify-end"
                    in:receive={{key: todo.id}}
                    out:send={{key: todo.id}}
                >
                    <input
                        bind:value={todo.text}
                        disabled={todo.done}
                        type="text"
                        name=""
                        id=""
                    />
                    <label class="mcui-checkbox">
                        <input type="checkbox" bind:checked={todo.done} />
                        <div>
                            <svg
                                class="mcui-check"
                                viewBox="-2 -2 35 35"
                                aria-hidden="true"
                            >
                                <title>checkmark-circle</title>
                                <polyline
                                    points="7.57 15.87 12.62 21.07 23.43 9.93"
                                />
                            </svg>
                        </div>
                        <div></div>
                    </label>
                    <button
                        class="border-red-800 rounded-md overflow-hidden duration-150"
                        class:w-0={!isDeleting}
                        class:w-16={isDeleting}
                        class:ml-2={isDeleting}
                        class:border-2={isDeleting}
                        onclick={() =>
                            (todos = todos.filter((t) => t.id !== todo.id))}
                        ><Bin class="mx-auto text-red-600" /></button
                    >
                </div>
            {/each}
        {/if}
    </div>
</div>
