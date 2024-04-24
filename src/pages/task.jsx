import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Helmet } from 'react-helmet';
import { Input, Button, Table, Modal, Form, FormGroup, Label, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DueDate from '../components/duedate.jsx';
import qs from 'qs';

const TaskPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        completed: false,
    });
    const [editedTask, setEditedTask] = useState({
        id: '', // Include the task ID in the edited task state
        title: '',
        description: '',
        dueDate: '',
        completed: false,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = reactLocalStorage.get("token");
        if (!token) {
            navigate('/signin'); // Redirect if user is not logged in
            return;
        }
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`;
            const response = await axios.get('/mysite/getalltasks');
            setTasks(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setFormData({ ...formData, [name]: val });
    };

    const createTask = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('/mysite/createtask', formData);
            alert('Task created successfully!');
            setIsModalOpen(false);
            setFormData({
                title: '',
                description: '',
                dueDate: '',
                completed: false,
            });

            // Fetch the updated task list
            const response = await axios.get('/mysite/getalltasks');
            setTasks(response.data);

        } catch (error) {
            console.error('Error creating task:', error);
            alert('Error creating task');
        }

        setLoading(false);
    };

    const handleEditTask = (task) => {
        // Set the edited task state with the values of the selected task
        setEditedTask({
            id: task.id,
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            completed: task.completed,
        });
        // Open the edit modal
        setIsEditModalOpen(true);
    };

    const handleSubmitEditTask = async (e) => {
        try {
            console.log('Edited Task:', editedTask); // Print the edited task data before sending the POST request
            // Send a POST request to update the task with the edited data
            const response = await axios.post('/mysite/edittask', editedTask);
            // Handle successful update
            alert('Task updated successfully!');
            setIsEditModalOpen(false);
            // Fetch the updated task list
            const updatedTasksResponse = await axios.get('/mysite/getalltasks');
            setTasks(updatedTasksResponse.data);
        } catch (error) {
            // Handle error
            console.error('Error updating task:', error);
            alert('Error updating task');
        }
    };

    const handleDeleteTask = async (taskId, fetchTasks) => {
        const confirmed = window.confirm("Are you sure you want to delete this task?");
        if (confirmed) {
            try {
                const payload = {
                    id: taskId,
                };
                const response = await axios.post('/mysite/deletetask', qs.stringify(payload), { timeout: 30000 });
                if (response.status === 200) {
                    alert('Task deleted successfully');
                    const response = await axios.get('/mysite/getalltasks');
                    setTasks(response.data);
                } else {
                    alert('Error deleting task');
                }
            } catch (error) {
                alert('Error deleting task: ' + error);
            }
        }
    };


    return (
        <div>
            <Helmet>
                <title>Task Page</title>
                <meta name="title" content="Task Page" />
            </Helmet>

            <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)}>
                <ModalHeader toggle={() => setIsModalOpen(!isModalOpen)}>Create New Task</ModalHeader>
                <ModalBody>
                    <Form onSubmit={createTask}>
                        <FormGroup>
                            <Label for="title">Title:</Label>
                            <Input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">Description:</Label>
                            <Input type="textarea" id="description" name="description" value={formData.description} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="dueDate">Due Date:</Label>
                            <Input type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input type="checkbox" name="completed" checked={formData.completed} onChange={handleChange} />{' '}
                                Completed
                            </Label>
                        </FormGroup>
                        <ModalFooter>
                            <Button color="primary" type="submit" disabled={loading}>Create</Button>{' '}
                            <Button color="secondary" onClick={() => setIsModalOpen(false)} disabled={loading}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </ModalBody>
            </Modal>

            {/* Edit Task Modal */}
            <Modal isOpen={isEditModalOpen} toggle={() => setIsEditModalOpen(!isEditModalOpen)}>
                <ModalHeader toggle={() => setIsEditModalOpen(!isEditModalOpen)}>Edit Task</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmitEditTask}>
                        <FormGroup>
                            <Label for="editTitle">Title:</Label>
                            <Input type="text" id="editTitle" name="title" value={editedTask.title} onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="editDescription">Description:</Label>
                            <Input type="textarea" id="editDescription" name="description" value={editedTask.description} onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="editDueDate">Due Date:</Label>
                            <Input type="date" id="editDueDate" name="dueDate" value={editedTask.dueDate} onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })} />
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input
                                    type="checkbox"
                                    name="completed"
                                    checked={editedTask.completed}
                                    onChange={(e) => setEditedTask({ ...editedTask, completed: e.target.checked })}
                                />
                                Completed
                            </Label>
                        </FormGroup>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleSubmitEditTask}>Save</Button>
                    <Button color="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                </ModalFooter>
            </Modal>

            <div style={styles.background} />
            <div style={{ paddingTop: '75px' }}>
            <div style={{ padding: '10px', borderStyle: 'solid', borderBottomWidth: 1, borderLeftWidth: 0, borderRightWidth: 0, borderTopWidth: 0, borderColor: 'lightgrey', marginLeft: '10px', marginRight: '10px', display:"flex",}}>
                <Button color="light" style={{ borderColor: 'lightgrey', borderStyle: 'solid', borderWidth: 1 }} onClick={() => setIsModalOpen(true)}>
                    Create new Task
                </Button>
            </div>

            {!loading && tasks.length > 0 && (
                <Table className="custom-table" style={{ width: '99%', borderCollapse: 'collapse', marginTop: '20px', marginLeft: '10px', marginRight: '10px' }}>
                    <thead>
                        <tr>
                            <th style={{ backgroundColor: 'rgb(32,178,170)',}}>Title</th>
                            <th style={{ backgroundColor: 'rgb(32,178,170)',}}>Description</th>
                            <th style={{ backgroundColor: 'rgb(32,178,170)',}}>Due Date</th>
                            <th style={{ backgroundColor: 'rgb(32,178,170)',}}>Completed</th>
                            <th style={{ backgroundColor: 'rgb(32,178,170)',}}>Action</th>
                            <th style={{ backgroundColor: 'rgb(32,178,170)',}}>Action</th>
                        </tr>
                    </thead>
                    <tbody style={{marginTop:'10px' }}>
                        {tasks.map(task => (
                            <tr key={task.id}>
                                <td style={{ verticalAlign: 'middle', backgroundColor: 'rgb(255, 255, 204)' }}>{task.title}</td>
                                <td style={{ verticalAlign: 'middle', backgroundColor: 'rgb(255, 255, 204)' }}>{task.description}</td>
                                <td style={{ verticalAlign: 'middle', backgroundColor: 'rgb(255, 255, 204)'}}>
                                    <DueDate dueDate={task.dueDate} />
                                </td>
                                <td style={{ verticalAlign: 'middle', backgroundColor: 'rgb(255, 255, 204)' }}>
                                    <input type="checkbox" checked={task.completed} />
                                </td>
                                <td style={{ verticalAlign: 'middle', backgroundColor: 'rgb(255, 255, 204)' }}>
                                    <Button color="light" style={{ backgroundColor: '#007BFF', borderColor: 'lightgrey', borderStyle: 'solid', borderWidth: 1, color: '#fff' }} onClick={() => handleEditTask(task)}>
                                        Edit
                                    </Button>
                                </td>
                                <td style={{ verticalAlign: 'middle', backgroundColor: 'rgb(255, 255, 204)' }}>
                                    <Button color="light" style={{ backgroundColor: '#DC3545', borderColor: 'lightgrey', borderStyle: 'solid', borderWidth: 1, color: '#fff' }} onClick={() => handleDeleteTask(task.id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
        </div>
    );
};

const styles = {
    container: {
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    background: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url("https://app-cdn.clickup.com/login__bg.8e44616319b55ac1.svg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.5, // Adjust the opacity as needed
        zIndex: -1,
    },

};

export default TaskPage;
