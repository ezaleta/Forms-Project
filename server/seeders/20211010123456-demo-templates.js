'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            'Templates',
            [
                {
                    title: 'Customer Satisfaction Survey',
                    description: 'A survey to measure customer satisfaction.',
                    topic: 'Customer Feedback',
                    isPublic: true,
                    authorId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    title: 'Employee Onboarding Form',
                    description:
                        'Form for new employees to fill out during onboarding.',
                    topic: 'Human Resources',
                    isPublic: false,
                    authorId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    title: 'Event Registration Form',
                    description: 'Collect information from event attendees.',
                    topic: 'Events',
                    isPublic: true,
                    authorId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    title: 'Product Feedback Survey',
                    description: 'Gather feedback on products from users.',
                    topic: 'Product Feedback',
                    isPublic: true,
                    authorId: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    title: 'Job Application Form',
                    description:
                        'Collect applicant information for job openings.',
                    topic: 'Recruitment',
                    isPublic: false,
                    authorId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    title: 'Course Evaluation Form',
                    description:
                        'Assess course effectiveness from student feedback.',
                    topic: 'Education',
                    isPublic: true,
                    authorId: 4,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    title: 'Bug Report Form',
                    description:
                        'Allow users to report bugs in the application.',
                    topic: 'Technical Support',
                    isPublic: true,
                    authorId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    title: 'Newsletter Subscription Form',
                    description: 'Collect emails for newsletter subscriptions.',
                    topic: 'Marketing',
                    isPublic: true,
                    authorId: 5,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    title: 'Volunteer Signup Sheet',
                    description:
                        'Sign up volunteers for events and activities.',
                    topic: 'Community Service',
                    isPublic: true,
                    authorId: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    title: 'Website Feedback Form',
                    description: 'Gather feedback on website usability.',
                    topic: 'User Experience',
                    isPublic: true,
                    authorId: 4,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Templates', null, {});
    },
};
