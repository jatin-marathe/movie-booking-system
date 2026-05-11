import { useEffect, useState } from 'react';
import adminApi from '../../../utils/adminApi';
import './Users.scss';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminApi.get('/users')
      .then(({ data }) => setUsers(data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="admin-users animate-in">
      <div className="admin-page-header">
        <div className="admin-page-header__left">
          <h1 className="admin-page-header__title">Users</h1>
          <p className="admin-page-header__sub">{users.length} registered users</p>
        </div>
      </div>

      <div className="admin-users__search-wrap">
        <input
          type="text"
          placeholder="🔍  Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="admin-users__search"
        />
      </div>

      <div className="admin-card">
        {loading ? (
          <p className="admin-users__loading">Loading users...</p>
        ) : filtered.length === 0 ? (
          <div className="admin-users__empty">
            <span>👥</span>
            <p>{search ? `No results for "${search}"` : 'No users yet'}</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="user-row">
                      <div className="user-row__avatar">{u.name[0].toUpperCase()}</div>
                      <span className="user-row__name">{u.name}</span>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
