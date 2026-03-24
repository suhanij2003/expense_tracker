import { useAuth } from '../context/AuthContext';

export default function Table({ data, onRowClick, onDelete, onEdit }) {
  const { hasPermission } = useAuth();
  const canEdit = hasPermission('canEdit');
  const canDelete = hasPermission('canDelete');

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>City</th>
          <th>Company</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {data && data.length > 0 ? (
          data.map(user => (
            <tr 
              key={user.id}
              onClick={() => onRowClick(user)}
            >
              <td style={{ fontWeight: "600" }}>
                {user.name}
              </td>
              <td>
                <a href={`mailto:${user.email}`} style={{ color: "#2196F3", textDecoration: "none" }}>
                  {user.email}
                </a>
              </td>
              <td>
                {user.address.city}
              </td>
              <td style={{ fontSize: "13px" }}>
                {user.company.name}
              </td>
              <td style={{ textAlign: "center" }}>
                <div className="action-buttons">
                  {canEdit && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit && onEdit(user);
                      }}
                      className="btn btn-primary"
                    >
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(user.id);
                      }}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  )}
                  {!canEdit && !canDelete && (
                    <span style={{ color: '#999', fontSize: '12px' }}>View only</span>
                  )}
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="empty-state">
              <div className="empty-state-icon"></div>
              <div className="empty-state-text">No users found. Try adjusting your search or filters.</div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}