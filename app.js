document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('item-form');
  const itemsList = document.getElementById('items-list');

  form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const description = document.getElementById('description').value;

      const newItem = await createItem({ name, description });
      addItemToDOM(newItem);
      form.reset();
  });

  async function fetchItems() {
      const response = await fetch('http://localhost:3000/items');
      const items = await response.json();
      items.forEach(addItemToDOM);
  }

  async function createItem(item) {
      const response = await fetch('http://localhost:3000/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
      });
      return await response.json();
  }

  async function updateItem(id) {
      const name = prompt('Enter new name:');
      const description = prompt('Enter new description:');

      const response = await fetch(`http://localhost:3000/items/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description })
      });
      const updatedItem = await response.json();

      const itemElement = document.querySelector(`li[data-id='${id}']`);
      itemElement.firstChild.textContent = `${updatedItem.name}: ${updatedItem.description}`;
  }

  async function deleteItem(id) {
      await fetch(`http://localhost:3000/items/${id}`, { method: 'DELETE' });
      document.querySelector(`li[data-id='${id}']`).remove();
  }

  function addItemToDOM(item) {
      const li = document.createElement('li');
      li.dataset.id = item.id;
      li.innerHTML = `${item.name}: ${item.description} 
          <button onclick="updateItem(${item.id})">Update</button> 
          <button onclick="deleteItem(${item.id})">Delete</button>`;
      itemsList.appendChild(li);
  }

  window.updateItem = updateItem;
  window.deleteItem = deleteItem;

  fetchItems();
});
