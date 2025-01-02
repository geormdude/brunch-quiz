const QUESTIONS = [
    {
        id: 'initialFilter',
        title: 'Is this a dinner or late night meal?',
        type: 'radio',
        options: [
            { value: 'no', label: 'No' },
            { value: 'yes', label: 'Yes' }
        ],
        validation: { required: true }
    },
    {
        id: 'timeOfDay',
        title: 'What time is your meal?',
        type: 'radio',
        options: [
            { value: 'before10', label: 'Before 10am' },
            { value: 'early', label: '10am - 11am' },
            { value: 'prime', label: '11am - 1pm' },
            { value: 'acceptable', label: '1pm - 3pm' },
            { value: 'after3', label: 'After 3pm' }
        ],
        validation: { required: true }
    },
    {
        id: 'isWeekend',
        title: 'Is this a weekend meal?',
        type: 'radio',
        options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
        ],
        validation: { required: true }
    },
    {
        id: 'breakfastItems',
        title: 'Select all breakfast items being served:',
        type: 'checkbox',
        options: [
            { value: 'eggs', label: 'Eggs (any style)' },
            { value: 'pancakesWaffles', label: 'Pancakes/Waffles' },
            { value: 'pastries', label: 'Pastries' },
            { value: 'toastBagels', label: 'Toast/Bagels' }
        ]
    },
    {
        id: 'lunchItems',
        title: 'Select all lunch items being served:',
        type: 'checkbox',
        options: [
            { value: 'sandwiches', label: 'Sandwiches' },
            { value: 'salads', label: 'Salads' },
            { value: 'soups', label: 'Soups' },
            { value: 'proteins', label: 'Proteins' }
        ]
    },
    {
        id: 'morningDrinks',
        title: 'Select all morning drinks being served:',
        type: 'checkbox',
        options: [
            { value: 'coffee', label: 'Coffee' },
            { value: 'tea', label: 'Tea' },
            { value: 'freshJuice', label: 'Fresh Juice' }
        ]
    },
    {
        id: 'celebratoryDrinks',
        title: 'Select all celebratory drinks being served:',
        type: 'checkbox',
        options: [
            { value: 'mimosas', label: 'Mimosas' },
            { value: 'bloodyMarys', label: 'Bloody Marys' },
            { value: 'bellinis', label: 'Bellinis' },
            { value: 'otherCocktails', label: 'Other Cocktails' }
        ]
    },
    {
        id: 'hasHydration',
        title: 'Are water/hydration options available?',
        type: 'radio',
        options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
        ],
        validation: { required: true }
    },
    {
        id: 'peopleCount',
        title: 'How many people are dining?',
        type: 'radio',
        options: [
            { value: 'solo', label: 'Solo' },
            { value: 'two', label: '2 people' },
            { value: 'small', label: '3-4 people' },
            { value: 'large', label: '5+ people' }
        ],
        validation: { required: true }
    },
    {
        id: 'location',
        title: 'Where are you dining?',
        type: 'radio',
        options: [
            { value: 'home', label: 'Home' },
            { value: 'restaurant', label: 'Restaurant' },
            { value: 'other', label: 'Other' }
        ],
        validation: { required: true }
    },
    {
        id: 'duration',
        title: 'Planned duration?',
        type: 'radio',
        options: [
            { value: 'quick', label: '30 min or less' },
            { value: 'hour', label: '~1 hour' },
            { value: 'extended', label: '1.5 hours' },
            { value: 'lengthy', label: '2+ hours' }
        ],
        validation: { required: true }
    }
];

const SCORING_WEIGHTS = {
    TIME_OF_DAY: {
        before10: 0,
        early: 15,
        prime: 30,
        acceptable: 20,
        after3: 0
    },
    WEEKEND: {
        yes: 10,
        no: 5
    },
    FOOD_MIX: {
        HAS_BREAKFAST: 10,
        HAS_LUNCH: 10,
        MULTIPLE_BREAKFAST: 5,
        MULTIPLE_LUNCH: 5
    },
    DRINKS: {
        MORNING: 7,
        CELEBRATORY: 7,
        HYDRATION: 6
    },
    SOCIAL: {
        MAX: 5,
        PER_PERSON: 1
    },
    DURATION: {
        quick: 1,
        hour: 3,
        extended: 4,
        lengthy: 5
    }
};