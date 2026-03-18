import { DataSource } from 'typeorm';
import { CategoryEntity } from '../../../modules/service-management/entities/category.entity';
import { ServiceEntity } from '../../../modules/service-management/entities/service.entity';

export async function servicesSeed(dataSource: DataSource) {
    const categoryRepo = dataSource.getRepository(CategoryEntity);
    const serviceRepo = dataSource.getRepository(ServiceEntity);

    // 1. Create the Main "All Categories" Root
    const rootCategoryId = '111e8400-e29b-41d4-a716-446655440000';
    let rootCategory = await categoryRepo.findOne({ where: { id: rootCategoryId } });
    if (!rootCategory) {
        rootCategory = categoryRepo.create({
            id: rootCategoryId,
            name: 'All Categories',
            nameAr: 'جميع الفئات',
            icon: 'apps',
            isActive: true
        });
        await categoryRepo.save(rootCategory);
    }

    // 2. Define Sub-categories
    const categories = [
        { id: '111e8400-e29b-41d4-a716-446655440001', name: 'Home Services', nameAr: 'خدمات المنزل', icon: 'home', parentId: rootCategoryId },
        { id: '111e8400-e29b-41d4-a716-446655440002', name: 'Car Services', nameAr: 'خدمات السيارات', icon: 'directions_car', parentId: rootCategoryId },
        { id: '111e8400-e29b-41d4-a716-446655440003', name: 'Technical', nameAr: 'تقنية', icon: 'settings', parentId: rootCategoryId },
        { id: '111e8400-e29b-41d4-a716-446655440004', name: 'Medical', nameAr: 'طبي', icon: 'medical_services', parentId: rootCategoryId },
        { id: '111e8400-e29b-41d4-a716-446655440005', name: 'Personal', nameAr: 'بياناتي', icon: 'person', parentId: rootCategoryId },
    ];

    console.log('Seeding Categories...');
    for (const cat of categories) {
        let category = await categoryRepo.findOne({ where: { id: cat.id } });
        if (!category) {
            category = categoryRepo.create({
                ...cat,
                parent: { id: cat.parentId } as CategoryEntity
            });
            await categoryRepo.save(category);
        } else {
            category.name = cat.name;
            category.nameAr = cat.nameAr;
            category.icon = cat.icon;
            category.parent = { id: cat.parentId } as CategoryEntity;
            await categoryRepo.save(category);
        }
    }

    // 3. Define Services
    const carCategoryId = '111e8400-e29b-41d4-a716-446655440002';
    const homeCategoryId = '111e8400-e29b-41d4-a716-446655440001';

    const services = [
        // Car Services
        { id: '222e8400-e29b-41d4-a716-446655440001', name: 'Car Wash', nameAr: 'غسيل السيارات', categoryId: carCategoryId },
        { id: '222e8400-e29b-41d4-a716-446655440002', name: 'Car Repair', nameAr: 'إصلاح السيارات', categoryId: carCategoryId },
        { id: '222e8400-e29b-41d4-a716-446655440003', name: 'Car Towing', nameAr: 'نقل السيارات', categoryId: carCategoryId },
        { id: '222e8400-e29b-41d4-a716-446655440004', name: 'Car Tires', nameAr: 'إطارات السيارات', categoryId: carCategoryId },
        // Home Services
        { id: '222e8400-e29b-41d4-a716-446655440101', name: 'Cleaning', nameAr: 'تنظيف المنزل', categoryId: homeCategoryId },
        { id: '222e8400-e29b-41d4-a716-446655440102', name: 'Pest Control', nameAr: 'مكافحة الآفات', categoryId: homeCategoryId },
        { id: '222e8400-e29b-41d4-a716-446655440103', name: 'Landscaping', nameAr: 'تنسيق حدائق', categoryId: homeCategoryId },
        { id: '222e8400-e29b-41d4-a716-446655440104', name: 'Electrical', nameAr: 'أعمال كهربائية', categoryId: homeCategoryId },
    ];

    console.log('Seeding Services...');
    for (const serv of services) {
        let service = await serviceRepo.findOne({ where: { id: serv.id } });
        if (!service) {
            service = serviceRepo.create({
                id: serv.id,
                name: serv.name,
                nameAr: serv.nameAr,
                category: { id: serv.categoryId } as CategoryEntity,
                isLeaf: true,
                depth: 0,
                sortOrder: 0,
                isActive: true
            });
            await serviceRepo.save(service);
        } else {
            service.name = serv.name;
            service.nameAr = serv.nameAr;
            service.category = { id: serv.categoryId } as CategoryEntity;
            await serviceRepo.save(service);
        }
    }
}
