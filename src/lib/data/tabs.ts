export const tabs = [
    {
        title: 'Home',
        path: '/',
        matches: '^\/$' 
    },
    {
        title: 'Objekts',
        path: '/objekt',
        matches: '^\/objekt'
    },
    {
        title: 'Gravity',
        path: '/gravity',
        matches: '^\/gravity'
    },
    {
        title: 'Users',
        path: '/users',
        matches: '^(\/users|\/@.+)$'
    }
]