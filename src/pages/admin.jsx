import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Helmet } from 'react-helmet';
import qs from 'qs';
import { Input, Button, Table, Modal, Form, FormGroup, Label, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const AdminPage = () => {
    const navigate = useNavigate();
    const [showUserData, setShowUserData] = useState(false);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to control the edit user modal
    const [editedUser, setEditedUser] = useState({}); // State to manage edited user data

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate('/signin');
            return;
        }
        axios.defaults.headers.common.Authorization = `Token ${token}`;
        showUsers();
    }, [navigate]);

    const showUsers = () => {
        setLoading(true);
        const payload = {};
        axios.post('/mysite/getalluserdata', qs.stringify(payload), { timeout: 30000 })
            .then(response => {
                setUsers(response.data);
                setLoading(false);
                setShowUserData(true);
            })
            .catch(error => {
                console.error('Error loading users:', error);
                setLoading(false);
            });
    };

    const handleEditUser = (user) => {
        setEditedUser({
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            is_staff: user.is_staff,
            last_login: user.last_login,
            date_joined: user.date_joined,
        });
        setIsEditModalOpen(true);
    };

    const handleSubmitEditUser = async () => {
        try {
            // Exclude the password field from the editedUser object
            const { password, ...userDataWithoutPassword } = editedUser;
            const response = await axios.post('/mysite/edituserdata', userDataWithoutPassword);
            alert('User edited successfully');
            setIsEditModalOpen(false);
            showUsers();
        } catch (error) {
            console.error('Error editing user:', error);
            alert('Error editing user');
        }
    };

    const handleDeleteUser = async (userId) => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (!confirmed) return;

        try {
            const payload = { id: userId };
            const response = await axios.post('/mysite/deleteuser', qs.stringify(payload), { timeout: 30000 });
            if (response.status === 200) {
                alert('User deleted successfully');
                showUsers();
            } else {
                alert('Error deleting user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user');
        }
    };


    return (
        <div>
             <Helmet>
                <title>Admin Page</title>
                <meta name="title" content="Admin Page" />
            </Helmet>

            {/* Edit User Modal */}
            <Modal isOpen={isEditModalOpen} toggle={() => setIsEditModalOpen(!isEditModalOpen)}>
                <ModalHeader toggle={() => setIsEditModalOpen(!isEditModalOpen)}>Edit User</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmitEditUser}>
                        <FormGroup>
                            <Label for="editUsername">Username:</Label>
                            <Input type="text" id="editUsername" readOnly value={editedUser.username} onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="editEmail">Email:</Label>
                            <Input type="email" id="editEmail"  value={editedUser.email} onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="editFirstName">First Name:</Label>
                            <Input type="text" id="editFirstName" value={editedUser.first_name} onChange={(e) => setEditedUser({ ...editedUser, first_name: e.target.value })} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="editLastName">Last Name:</Label>
                            <Input type="text" id="editLastName" value={editedUser.last_name} onChange={(e) => setEditedUser({ ...editedUser, last_name: e.target.value })} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="editIsStaff">Is Staff:</Label>
                            <Input type="checkbox" id="editIsStaff" readOnly checked={editedUser.is_staff} onChange={(e) => setEditedUser({ ...editedUser, is_staff: e.target.checked })} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="editLastLogin">Last Login:</Label>
                            <Input type="text" id="editLastLogin" readOnly value={editedUser.last_login} onChange={(e) => setEditedUser({ ...editedUser, last_login: e.target.value })} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="editDateJoined">Date Joined:</Label>
                            <Input type="text" id="editDateJoined" readOnly value={editedUser.date_joined} onChange={(e) => setEditedUser({ ...editedUser, date_joined: e.target.value })} />
                        </FormGroup>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleSubmitEditUser}>Save</Button>
                    <Button color="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                </ModalFooter>
            </Modal>

            <div style={styles.background} />
            <div style={{ paddingTop: '80px' }} />
            <div style={styles.pageTitle}>Admin Page</div>
            {!loading && users.length > 0 && (
            <Table className="custom-tables" style={{ width: '50%', borderCollapse: 'collapse', marginTop: '15px', marginLeft: '10px', marginRight: '10px',}}>
                    <thead>
                        <tr style={{}}>
                            <th style={{ backgroundColor: 'rgb(32,178,170)',}}>Username</th>
                            <th style={{ backgroundColor: 'rgb(32,178,170)',}}>Last Login</th>
                            <th style={{ backgroundColor: 'rgb(32,178,170)',}}>Staff Status</th>
                            <th style={{ backgroundColor: 'rgb(32,178,170)',}}>Action</th>
                            <th style={{ backgroundColor: 'rgb(32,178,170)',}}>Action</th>
                            {/* Add other table headers if needed */}
                        </tr>
                    </thead>
                    <tbody style={{ marginTop: '5px' }}>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td style={{ verticalAlign: 'middle', backgroundColor: 'rgb(255, 255, 204)' }}>{user.username}</td>
                                <td style={{ verticalAlign: 'middle', backgroundColor: 'rgb(255, 255, 204)' }}>{user.last_login}</td>
                                <td style={{ verticalAlign: 'middle', backgroundColor: 'rgb(255, 255, 204)' }}>{user.is_staff ? 'Yes' : 'No'}</td> {/* Display Yes/No based on is_staff */}
                                <td style={{ verticalAlign: 'middle', backgroundColor: 'rgb(255, 255, 204)' }}>
                                    <Button color="light" style={{ backgroundColor: '#007BFF', borderColor: 'lightgrey', borderStyle: 'solid', borderWidth: 1, color: '#fff' }} onClick={() => handleEditUser(user)}>
                                        Edit
                                    </Button>
                                </td>
                                <td style={{ verticalAlign: 'middle', backgroundColor: 'rgb(255, 255, 204)' }}>
                                    <Button color="light" style={{ backgroundColor: '#DC3545', borderColor: 'lightgrey', borderStyle: 'solid', borderWidth: 1, color: '#fff' }} onClick={() => handleDeleteUser(user.id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

const styles = {

    background: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url("https://app-cdn.clickup.com/login__bg.8e44616319b55ac1.svg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.5,
        zIndex: -1,
    },
    table: {
        width: '50%',
        borderCollapse: 'collapse',
        marginTop: '20px',
    },
    pageTitle: {
        fontWeight: 'bold',
        fontSize: '24px',
        marginLeft: '15px', // Adjust margin-left as needed
    },
    content: {
        zIndex: 1,
        textAlign: 'center',
        color: '#fff',
    },
    tr: {

    },
};


export default AdminPage;
