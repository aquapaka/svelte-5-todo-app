<script lang="ts">
    type Todo = {
        text: string;
        done: boolean;
    };
    type Filters = "all" | "active" | "completed";

    let todos = $state<Todo[]>([
        { text: "Todo 1", done: false },
        { text: "Todo 2", done: false },
        { text: "Todo 3", done: false },
    ]);
    let filter = $state<Filters>("all");
    let filteredTodos = $derived(filterTodos());

    $effect(() => {
        console.log(todos);

        const savedTodos = localStorage.getItem("todos");
        if (savedTodos) {
            todos = JSON.parse(savedTodos);
        }
    });

    function addTodo(event: KeyboardEvent) {
        if (event.key !== "Enter") return;

        const todoEl = event.target as HTMLInputElement;
        const text = todoEl.value;
        const done = false;

        todos.unshift({ text, done: false });
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

<h1>{JSON.stringify(todos)}</h1>
<h1>{JSON.stringify(filter)}</h1>

<div
    class="todos bg-gray-800 text-blue-100 min-h-screen flex justify-center items-center"
>
    <div class="todo max-w-xs flex flex-col gap-1">
        <input
            class="p-3"
            onkeydown={addTodo}
            placeholder="Add new todo..."
            type="text"
        />
        <div class="grid grid-cols-3 gap-2 my-1">
            <button
                class="py-1 px-3 bg- border-2 border-gray-600 rounded-md"
                class:bg-teal-800={filter === "all"}
                onclick={() => setFilter("all")}>All</button
            >
            <button
                class="py-1 px-3 border-2 border-gray-600 rounded-md"
                class:bg-teal-800={filter === "active"}
                onclick={() => setFilter("active")}>Active</button
            >
            <button
                class="py-1 px-3 border-2 border-gray-600 rounded-md"
                class:bg-teal-800={filter === "completed"}
                onclick={() => setFilter("completed")}>Completed</button
            >
        </div>
        {#each filteredTodos as todo, i}
            <div
                class:opacity-50={todo.done}
                class="bg-gray-700 flex p-3 gap-3 rounded-md duration-200"
            >
                <input bind:value={todo.text} type="text" name="" id="" />
                <input bind:checked={todo.done} type="checkbox" name="" id="" />
            </div>
        {/each}
    </div>
</div>
