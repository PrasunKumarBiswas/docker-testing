import DashboardMenu from '../components/DashboardMenu';
import { getUsers, deleteUser } from '../api';
import { showLoading, hideLoading, rerender, showMessage } from '../utils';

const UserListScreen = {
  after_render: () => {
    const deleteButtons = document.getElementsByClassName('delete-button');
    Array.from(deleteButtons).forEach((deleteButton) => {
      deleteButton.addEventListener('click', async () => {
        if (confirm('Are you sure to delete this order?')) {
          showLoading();
          const data = await deleteUser(deleteButton.id);
          if (data.error) {
            showMessage(data.error);
          } else {
            rerender(UserListScreen);
          }
          hideLoading();
        }
      });
    });
  },
  render: async () => {
    const users = await getUsers({});
    return `
    <div class="dashboard">
    ${DashboardMenu.render({ selected: 'users' })}
    <div class="dashboard-content">
      <h1>Users</h1>
      <h3>Warning: delete all order instances of the user before deleting the user</h3>
      <div class="user-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL-ID</th>
              <th>PASSWORD</th>
              <th>PHONE-NO</th>
              <th>ADDRESS</th>
              <th class="tr-action">ACTION</th>
            <tr>
          </thead>
          <tbody>
            ${users
              .map(
                (user) => `
            <tr>
              <td>${user._id}</td>
              <td>${user.name}</td>
              <td>${user.email}</td>
              <td>${user.password}</td>
              <td>${user.phoneno}</td>
              <td>${user.address}</td>
              <td>
              <button id="${user._id}" class="delete-button">Delete</button>
              </td>
            </tr>
            `
              )
              .join('\n')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
    `;
  },
};
export default UserListScreen;