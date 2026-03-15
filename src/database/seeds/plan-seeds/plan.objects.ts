export const featuresObjects = [
    { id: '11111111-1111-4111-8111-111111111111', name: 'Bookings', description: 'Monthly booking limit' },
    { id: '22222222-2222-4222-8222-222222222222', name: 'Analytics', description: 'Analytics and insights level' },
    { id: '33333333-3333-4333-8333-333333333333', name: 'Support', description: 'Customer support level' },
    { id: '44444444-4444-4444-8444-444444444444', name: 'Mobile App Access', description: 'Access to mobile application' },
    { id: '55555555-5555-4555-8555-555555555555', name: 'Commission', description: 'Platform commission rate' },
    { id: '66666666-6666-4666-8666-666666666666', name: 'Marketing Tools', description: 'Access to marketing tools' },
    { id: '77777777-7777-4777-8777-777777777777', name: 'Featured Listing', description: 'Featured in provider search' },
    { id: '88888888-8888-4888-8888-888888888888', name: 'API Access', description: 'Developer API access' },
    { id: '99999999-9999-4999-8999-999999999999', name: 'Premium Placement', description: 'Premium placement in results' },
    { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', name: 'White-label Options', description: 'White label branding options' },
];

export const plansObjects = [
    {
        id: '1a1a1a1a-1a1a-4a1a-8a1a-1a1a1a1a1a1a',
        name: 'Starter',
        description: 'Perfect for new providers',
        icon: 'star',
        isPopular: false,
        isCustomized: false,
    },
    {
        id: '2b2b2b2b-2b2b-4b2b-8b2b-2b2b2b2b2b2b',
        name: 'Professional',
        description: 'Popular for growing business',
        icon: 'star_filled',
        isPopular: true,
        isCustomized: false,
    },
    {
        id: '3c3c3c3c-3c3c-4c3c-8c3c-3c3c3c3c3c3c',
        name: 'Enterprise',
        description: 'For large-scale operations',
        icon: 'crown',
        isPopular: false,
        isCustomized: false,
    },
    {
        id: '4d4d4d4d-4d4d-4d4d-8d4d-4d4d4d4d4d4d',
        name: 'Customized Plan',
        description: 'Reach out to our sales team for a tailored plan. Let\'s work together to find a deal that suits you. Enjoy flexible service lengths and choices. Take advantage of adjustable margins. We\'re here to help you get the most value from your plan!',
        icon: 'settings',
        isPopular: false,
        isCustomized: true,
    },
];

export const planFeaturesObjects = [
    // Starter specific
    { id: '11111aaa-1111-4111-8111-111111111111', planId: plansObjects[0].id, featureId: featuresObjects[0].id, value: 'Up to 50', isIncluded: true },
    { id: '11111bbb-1111-4111-8111-111111111111', planId: plansObjects[0].id, featureId: featuresObjects[1].id, value: 'Basic analytics', isIncluded: true },
    { id: '11111ccc-1111-4111-8111-111111111111', planId: plansObjects[0].id, featureId: featuresObjects[2].id, value: 'Email support', isIncluded: true },
    { id: '11111ddd-1111-4111-8111-111111111111', planId: plansObjects[0].id, featureId: featuresObjects[3].id, value: 'Mobile app access', isIncluded: true },
    { id: '11111eee-1111-4111-8111-111111111111', planId: plansObjects[0].id, featureId: featuresObjects[4].id, value: '12%', isIncluded: true },
    { id: '11111fff-1111-4111-8111-111111111111', planId: plansObjects[0].id, featureId: featuresObjects[5].id, value: null, isIncluded: false },
    { id: '11111000-1111-4111-8111-111111111111', planId: plansObjects[0].id, featureId: featuresObjects[6].id, value: null, isIncluded: false },
    { id: '11111110-1111-4111-8111-111111111111', planId: plansObjects[0].id, featureId: featuresObjects[7].id, value: null, isIncluded: false },
    { id: '11111220-1111-4111-8111-111111111111', planId: plansObjects[0].id, featureId: featuresObjects[8].id, value: null, isIncluded: false },
    { id: '11111330-1111-4111-8111-111111111111', planId: plansObjects[0].id, featureId: featuresObjects[9].id, value: null, isIncluded: false },

    // Professional specific
    { id: '22222aaa-2222-4222-8222-222222222222', planId: plansObjects[1].id, featureId: featuresObjects[0].id, value: 'Up to 200', isIncluded: true },
    { id: '22222bbb-2222-4222-8222-222222222222', planId: plansObjects[1].id, featureId: featuresObjects[1].id, value: 'Advanced analytics & insights', isIncluded: true },
    { id: '22222ccc-2222-4222-8222-222222222222', planId: plansObjects[1].id, featureId: featuresObjects[2].id, value: 'Priority support 24/7', isIncluded: true },
    { id: '22222ddd-2222-4222-8222-222222222222', planId: plansObjects[1].id, featureId: featuresObjects[4].id, value: '8%', isIncluded: true },
    { id: '22222eee-2222-4222-8222-222222222222', planId: plansObjects[1].id, featureId: featuresObjects[5].id, value: 'Marketing tools', isIncluded: true },
    { id: '22222fff-2222-4222-8222-222222222222', planId: plansObjects[1].id, featureId: featuresObjects[6].id, value: 'Featured listing', isIncluded: true },

    // Enterprise specific
    { id: '33333aaa-3333-4333-8333-333333333333', planId: plansObjects[2].id, featureId: featuresObjects[0].id, value: 'Unlimited', isIncluded: true },
    { id: '33333bbb-3333-4333-8333-333333333333', planId: plansObjects[2].id, featureId: featuresObjects[1].id, value: 'Custom analytics & reporting', isIncluded: true },
    { id: '33333ccc-3333-4333-8333-333333333333', planId: plansObjects[2].id, featureId: featuresObjects[2].id, value: 'Dedicated account manager', isIncluded: true },
    { id: '33333ddd-3333-4333-8333-333333333333', planId: plansObjects[2].id, featureId: featuresObjects[4].id, value: '5%', isIncluded: true },
    { id: '33333eee-3333-4333-8333-333333333333', planId: plansObjects[2].id, featureId: featuresObjects[7].id, value: 'API access', isIncluded: true },
    { id: '33333fff-3333-4333-8333-333333333333', planId: plansObjects[2].id, featureId: featuresObjects[8].id, value: 'Premium placement', isIncluded: true },
    { id: '33333000-3333-4333-8333-333333333333', planId: plansObjects[2].id, featureId: featuresObjects[9].id, value: 'White-label options', isIncluded: true },
];

export const planPricesObjects = [
    // Starter prices
    { id: '11111111-1000-4000-8000-111111111111', planId: plansObjects[0].id, billingCycleId: '2e7e891c-8b2c-4b6e-827c-36b5674c9351', amount: 199, currency: 'AED' },
    { id: '11111111-2000-4000-8000-111111111111', planId: plansObjects[0].id, billingCycleId: '8cbf916c-4821-4f7b-951c-4b3d872c65fe', amount: 199 * 3 * 0.90, currency: 'AED' },
    { id: '11111111-3000-4000-8000-111111111111', planId: plansObjects[0].id, billingCycleId: 'bf2e896c-d2c6-4b8a-81a2-5c9b74d6821e', amount: 199 * 6 * 0.75, currency: 'AED' },
    { id: '11111111-4000-4000-8000-111111111111', planId: plansObjects[0].id, billingCycleId: 'df5e8c1b-e2a4-4f9e-bc16-d3b5c742819a', amount: 199 * 12 * 0.85, currency: 'AED' },

    // Professional prices
    { id: '22222222-1000-4000-8000-222222222222', planId: plansObjects[1].id, billingCycleId: '2e7e891c-8b2c-4b6e-827c-36b5674c9351', amount: 499, currency: 'AED' },
    { id: '22222222-2000-4000-8000-222222222222', planId: plansObjects[1].id, billingCycleId: '8cbf916c-4821-4f7b-951c-4b3d872c65fe', amount: 499 * 3 * 0.90, currency: 'AED' },
    { id: '22222222-3000-4000-8000-222222222222', planId: plansObjects[1].id, billingCycleId: 'bf2e896c-d2c6-4b8a-81a2-5c9b74d6821e', amount: 499 * 6 * 0.75, currency: 'AED' },
    { id: '22222222-4000-4000-8000-222222222222', planId: plansObjects[1].id, billingCycleId: 'df5e8c1b-e2a4-4f9e-bc16-d3b5c742819a', amount: 499 * 12 * 0.85, currency: 'AED' },

    // Enterprise prices
    { id: '33333333-1000-4000-8000-333333333333', planId: plansObjects[2].id, billingCycleId: '2e7e891c-8b2c-4b6e-827c-36b5674c9351', amount: 999, currency: 'AED' },
    { id: '33333333-2000-4000-8000-333333333333', planId: plansObjects[2].id, billingCycleId: '8cbf916c-4821-4f7b-951c-4b3d872c65fe', amount: 999 * 3 * 0.90, currency: 'AED' },
    { id: '33333333-3000-4000-8000-333333333333', planId: plansObjects[2].id, billingCycleId: 'bf2e896c-d2c6-4b8a-81a2-5c9b74d6821e', amount: 999 * 6 * 0.75, currency: 'AED' },
    { id: '33333333-4000-4000-8000-333333333333', planId: plansObjects[2].id, billingCycleId: 'df5e8c1b-e2a4-4f9e-bc16-d3b5c742819a', amount: 999 * 12 * 0.85, currency: 'AED' },
];
