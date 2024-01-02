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
        title: 'Users',
        path: '/users',
        matches: '^(\/users|\/@.+)$'
    }
]