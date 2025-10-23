import React from 'react';

const ActionsPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Take Action</h1>
            <p className="text-lg mb-8">Join us in making a difference! Here are some ways you can get involved:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg shadow">
                    <h2 className="text-xl font-semibold">Petitions</h2>
                    <p>Sign our petitions to support important causes.</p>
                    <button className="mt-2 px-4 py-2 bg-emerald-500 text-white rounded">Sign Now</button>
                </div>
                <div className="p-4 border rounded-lg shadow">
                    <h2 className="text-xl font-semibold">Quizzes</h2>
                    <p>Test your knowledge and learn more about our initiatives.</p>
                    <button className="mt-2 px-4 py-2 bg-emerald-500 text-white rounded">Take Quiz</button>
                </div>
            </div>
        </div>
    );
};

export default ActionsPage;