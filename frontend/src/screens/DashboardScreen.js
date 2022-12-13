import DashboardMenu from '../components/DashboardMenu';

const DashboardScreen = {
  after_render: () => {},
  render: () => {
    return `
    <div class="dashboard">
      ${DashboardMenu.render({ selected: 'dashboard' })}      
    </div>
    `;
  },
};
export default DashboardScreen;
 