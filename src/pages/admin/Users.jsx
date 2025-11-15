import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Users as UsersIcon, Search, Filter, Edit, Trash2, UserPlus, Shield, UserCheck, UserX } from 'lucide-react';
import { userService } from '../../services/userService';

const ROLE_LABELS = {
  0: 'EV Owner',
  1: 'Buyer',
  2: 'Verifier',
  3: 'Admin',
  'EvOwner': 'EV Owner',
  'Buyer': 'Buyer',
  'Cva': 'Verifier',
  'Admin': 'Admin'
};

const ROLE_COLORS = {
  0: 'bg-blue-100 text-blue-800',
  1: 'bg-green-100 text-green-800',
  2: 'bg-purple-100 text-purple-800',
  3: 'bg-red-100 text-red-800',
  'EvOwner': 'bg-blue-100 text-blue-800',
  'Buyer': 'bg-green-100 text-green-800',
  'Cva': 'bg-purple-100 text-purple-800',
  'Admin': 'bg-red-100 text-red-800'
};

const STATUS_COLORS = {
  'Active': 'bg-green-100 text-green-800',
  'Inactive': 'bg-gray-100 text-gray-800',
  'Suspended': 'bg-red-100 text-red-800',
  'Pending': 'bg-yellow-100 text-yellow-800'
};

// Helper function to convert string role to number
const getRoleNumber = (role) => {
  if (typeof role === 'number') return role;
  const roleMap = {
    'EvOwner': 0,
    'Buyer': 1,
    'Cva': 2,
    'Admin': 3
  };
  return roleMap[role] !== undefined ? roleMap[role] : role;
};

// Helper function to get role label
const getRoleLabel = (role) => {
  return ROLE_LABELS[role] || role;
};

// Helper function to get role color
const getRoleColor = (role) => {
  return ROLE_COLORS[role] || 'bg-gray-100 text-gray-800';
};

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      console.log('Users response:', response); // Debug log
      
      // Handle both response formats: direct array or wrapped in ApiResponse
      if (Array.isArray(response)) {
        setUsers(response);
      } else if (response.success && response.data) {
        setUsers(response.data);
      } else if (response.data && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error('Unexpected response format:', response);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await userService.activateUser(userId);
      fetchUsers();
    } catch (error) {
      console.error('Error activating user:', error);
      alert('Không thể kích hoạt người dùng');
    }
  };

  const handleDeactivateUser = async (userId) => {
    try {
      await userService.deactivateUser(userId);
      fetchUsers();
    } catch (error) {
      console.error('Error deactivating user:', error);
      alert('Không thể vô hiệu hóa người dùng');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }
    try {
      await userService.deleteUser(userId);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Không thể xóa người dùng');
    }
  };

  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(getRoleNumber(user.role));
    setShowRoleModal(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    try {
      await userService.updateUserRole(selectedUser.id, newRole);
      setShowRoleModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Không thể cập nhật vai trò');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const userRoleNum = getRoleNumber(user.role);
    const matchesRole = filterRole === 'all' || userRoleNum === parseInt(filterRole);
    return matchesSearch && matchesRole;
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý người dùng</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Quản lý tất cả người dùng trong hệ thống</p>
          </div>
          <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            <UserPlus className="h-5 w-5" />
            Thêm người dùng
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Tổng người dùng</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
              </div>
            </div>
          </div>
          {[0, 1, 2].map(role => (
            <div key={role} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${ROLE_COLORS[role]}`}>
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{ROLE_LABELS[role]}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {users.filter(u => getRoleNumber(u.role) === role).length}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo email hoặc tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400 dark:text-gray-300" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="0">EV Owner</option>
                <option value="1">Buyer</option>
                <option value="2">Verifier</option>
                <option value="3">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-colors">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 transition-colors">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Người dùng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Số điện thoại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold">
                            {user.fullName?.charAt(0) || user.email?.charAt(0) || '?'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.fullName || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-300">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[user.status] || 'bg-gray-100 text-gray-800'}`}>
                          {user.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleActivateUser(user.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Kích hoạt"
                          >
                            <UserCheck className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleDeactivateUser(user.id)}
                            className="text-orange-600 hover:text-orange-900"
                            title="Vô hiệu hóa"
                          >
                            <UserX className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleOpenRoleModal(user)}
                            className="text-emerald-600 hover:text-emerald-900"
                            title="Thay đổi vai trò"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Xóa"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <UsersIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Không có người dùng</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Không tìm thấy người dùng nào phù hợp.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Role Change Modal */}
        {showRoleModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 transition-colors">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Thay đổi vai trò</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Người dùng: {selectedUser.fullName || selectedUser.email}
                </p>
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chọn vai trò mới
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                >
                  <option value={0}>EV Owner</option>
                  <option value={1}>Buyer</option>
                  <option value={2}>Verifier (CVA)</option>
                  <option value={3}>Admin</option>
                </select>
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ Thay đổi vai trò sẽ ảnh hưởng đến quyền truy cập của người dùng.
                  </p>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdateRole}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
