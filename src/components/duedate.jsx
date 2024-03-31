import React from 'react';

const TaskComponent = ({ dueDate }) => {
    // Parse the due date string and format it
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Format the due date string
    const formattedDueDate = formatDate(dueDate);

    return (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <p style={{ margin: 3 }}>{formattedDueDate}</p>
        </div>
    );
};

export default TaskComponent;
