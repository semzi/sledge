import { ArrowUpRight, TrendingUp, Settings, Bell, LayoutDashboard, Users, DollarSign, BarChart3, ChevronRight } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#09090b] font-poppins">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-v2 border-r border-white/20 p-4">
        <div className="flex items-center justify-center mb-8">
          <img src="/logo-white.png" alt="Sledge Logo" className="w-24" />
        </div>
        <nav>
          <ul>
            <li className="mb-2">
              <a href="#" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-700/50 p-2 rounded-lg">
                <LayoutDashboard className="w-5 h-5 mr-3" />
                Dashboard
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-700/50 p-2 rounded-lg">
                <Users className="w-5 h-5 mr-3" />
                Users
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-700/50 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 mr-3" />
                Sales
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-700/50 p-2 rounded-lg">
                <BarChart3 className="w-5 h-5 mr-3" />
                Reports
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-700/50 p-2 rounded-lg">
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="w-full bg-dark-v2 border-b border-white/20 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-700/50">
              <img src="/logo-white.png" alt="Sledge Logo" className="w-8 h-8" />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-700/50 text-white">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-700/50 text-white">
              <Settings className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <img src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250" alt="User Avatar" className="w-8 h-8 rounded-full" />
              <span className="text-white text-sm">Jay</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="min-h-screen bg-[#09090b] text-white p-8 font-poppins">
            <div className="max-w-7xl mx-auto">
              {/* Header Section */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-4xl font-bold gradient-text">Welcome back, Stephen</h1>
                  <p className="text-gray-300">Here's your Cohort overview</p>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-700">12 months</button>
                  <button className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-700">24 hours</button>
                  <button className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-700">30 days</button>
                  <button className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-700">7 days</button>
                </div>
              </div>

              {/* Cohort Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-dark-v2 border border-white/20 rounded-lg shadow-xl p-6">
                  <p className="text-gray-300 text-sm">Participants</p>
                  <h2 className="text-3xl font-bold gradient-text">500</h2>
                  <p className="text-gray-300 text-sm">Last Cohort: 450 <span className="text-green-500">↗ 11%</span></p>
                </div>
                <div className="bg-dark-v2 border border-white/20 rounded-lg shadow-xl p-6">
                  <p className="text-gray-300 text-sm">Leads</p>
                  <h2 className="text-3xl font-bold gradient-text">1.2K</h2>
                  <p className="text-gray-300 text-sm">Last Month: 1K <span className="text-green-500">↗ 20%</span></p>
                </div>
                <div className="bg-dark-v2 border border-white/20 rounded-lg shadow-xl p-6">
                  <p className="text-gray-300 text-sm">Total Income</p>
                  <h2 className="text-3xl font-bold gradient-text">₦1.77M</h2>
                  <p className="text-gray-300 text-sm">Last Year: ₦2.46M <span className="text-red-500">↘ 30%</span></p>
                </div>
                <div className="bg-dark-v2 border border-white/20 rounded-lg shadow-xl p-6">
                  <p className="text-gray-300 text-sm">Cohort Status</p>
                  <h2 className="text-3xl font-bold gradient-text text-green-500">Live</h2>
                  <p className="text-gray-300 text-sm">Next Cohort: Jan 2026</p>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sum of Sales by Area (Left) */}
                <div className="lg:col-span-2 bg-dark-v2 border border-white/20 rounded-lg shadow-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Sum of Sales by Area</h3>
                  <div className="flex items-center justify-center h-64">
                    {/* Placeholder for Donut Chart */}
                    <div className="w-40 h-40 rounded-full bg-green-500 flex items-center justify-center text-white text-lg font-bold">Chart</div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-300">$30.98K (17.47%)</p>
                    <p className="text-gray-300">$31.94K (18.01%)</p>
                    <p className="text-gray-300">$32.87K (18.53%)</p>
                    <p className="text-gray-300">$39.2K (22.11%)</p>
                    <p className="text-gray-300">$42.35K (23.88%)</p>
                  </div>
                </div>

                {/* Revenue and Orders (Right, Top) */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-dark-v2 border border-white/20 rounded-lg shadow-xl p-6">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-gray-300 text-sm">New Revenue</p>
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold gradient-text">$82K</h2>
                    <p className="text-gray-300 text-sm">LY: $118K <span className="text-green-500">↗ 14%</span></p>
                  </div>
                  <div className="bg-dark-v2 border border-white/20 rounded-lg shadow-xl p-6">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-gray-300 text-sm">New Orders</p>
                      <ArrowUpRight className="w-5 h-5 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold gradient-text">$72K</h2>
                    <p className="text-gray-300 text-sm">LY: $102K <span className="text-green-500">↗ 14%</span></p>
                  </div>

                  {/* Sum of Sales by Date (Right, Bottom) */}
                  <div className="bg-dark-v2 border border-white/20 rounded-lg shadow-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Sum of Sales by Date</h3>
                    <div className="h-48 bg-gray-700 flex items-center justify-center text-white">Chart Placeholder</div>
                  </div>
                </div>
              </div>

              {/* Customers Table */}
              <div className="mt-8 bg-dark-v2 border border-white/20 rounded-lg shadow-xl p-6">
                <h3 className="text-xl font-bold mb-4">Customers</h3>
                <table className="w-full text-left table-auto">
                  <thead>
                    <tr className="text-gray-300 border-b border-gray-700">
                      <th className="py-2 px-4">Country</th>
                      <th className="py-2 px-4">Country Code</th>
                      <th className="py-2 px-4">First Name</th>
                      <th className="py-2 px-4">Last Name</th>
                      <th className="py-2 px-4">City</th>
                      <th className="py-2 px-4">Purchases</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-700">
                      <td className="py-2 px-4 flex items-center gap-2"><img src="https://flagcdn.com/w20/it.png" className="w-5 h-auto" /> Italy</td>
                      <td className="py-2 px-4">IT</td>
                      <td className="py-2 px-4">Daniel</td>
                      <td className="py-2 px-4">Thomas</td>
                      <td className="py-2 px-4">Rome</td>
                      <td className="py-2 px-4">$1,100</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-2 px-4 flex items-center gap-2"><img src="https://flagcdn.com/w20/gb.png" className="w-5 h-auto" /> United Kingdom</td>
                      <td className="py-2 px-4">GB</td>
                      <td className="py-2 px-4">David</td>
                      <td className="py-2 px-4">Davis</td>
                      <td className="py-2 px-4">London</td>
                      <td className="py-2 px-4">$1,000</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 flex items-center gap-2"><img src="https://flagcdn.com/w20/ca.png" className="w-5 h-auto" /> Canada</td>
                      <td className="py-2 px-4">CA</td>
                      <td className="py-2 px-4">Lisa</td>
                      <td className="py-2 px-4">Thompson</td>
                      <td className="py-2 px-4">Toronto</td>
                      <td className="py-2 px-4">$900</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
