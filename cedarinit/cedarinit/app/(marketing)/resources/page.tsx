import React from 'react';

const ResourcesPage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Resources</h1>
            <p className="mb-4">Here you can find various resources, including PDFs and useful links.</p>
            <ul className="list-disc pl-5">
                {/* Placeholder for resources; add links or PDFs here */}
                <li><a href="#" className="text-blue-500 hover:underline">Resource 1</a></li>
                <li><a href="#" className="text-blue-500 hover:underline">Resource 2</a></li>
                <li><a href="#" className="text-blue-500 hover:underline">Resource 3</a></li>
            </ul>
        </div>
    );
};

export default ResourcesPage;