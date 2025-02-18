import { ElementService } from '../application/element_service';
import { ElementRepository } from '../domain/element';
import { jest } from '@jest/globals';

describe('ElementService', () => {
    let elementService: ElementService;
    let mockElementRepository: jest.Mocked<ElementRepository>;

    beforeEach(() => {
        mockElementRepository = {
            initialize: jest.fn(),
            loadInitialState: jest.fn(),
            saveElement: jest.fn(),
            deleteElement: jest.fn(),
        } as unknown as jest.Mocked<ElementRepository>;

        elementService = new ElementService(mockElementRepository);
    });

    describe('initialize', () => {
        it('should initialize repository and load initial state', async () => {
            const mockElements = [
                { id: '1', name: 'Element 1', type: 'rectangle' },
                { id: '2', name: 'Element 2', type: 'circle' },
            ];
            mockElementRepository.loadInitialState.mockResolvedValue(mockElements);

            await elementService.initialize();

            expect(mockElementRepository.initialize).toHaveBeenCalled();
            expect(mockElementRepository.loadInitialState).toHaveBeenCalled();
            expect(elementService.getElements()).toEqual(mockElements);
        });
    });

    describe('getElements', () => {
        it('should return all elements', () => {
            const mockElements = [
                { id: '1', name: 'Element 1', type: 'rectangle' },
                { id: '2', name: 'Element 2', type: 'circle' },
            ];
            elementService['elements'] = mockElements;

            const result = elementService.getElements();

            expect(result).toEqual(mockElements);
        });
    });

    describe('createElement', () => {
        it('should add a new element and save it to the repository', async () => {
            const newElement = { id: '3', name: 'Element 3', type: 'triangle' };
            mockElementRepository.saveElement.mockResolvedValue();

            await elementService.createElement(newElement);

            expect(elementService.getElements()).toContainEqual(newElement);
            expect(mockElementRepository.saveElement).toHaveBeenCalledWith(newElement);
        });
    });

    describe('updateElement', () => {
        it('should update an existing element and save it to the repository', async () => {
            const initialElements = [
                { id: '1', name: 'Element 1', type: 'rectangle' },
                { id: '2', name: 'Element 2', type: 'circle' },
            ];
            elementService['elements'] = initialElements;

            const updatedElement = { id: '1', name: 'Updated Element 1', type: 'square' };
            mockElementRepository.saveElement.mockResolvedValue();

            await elementService.updateElement(updatedElement);

            expect(elementService.getElements()).toContainEqual(updatedElement);
            expect(mockElementRepository.saveElement).toHaveBeenCalledWith(updatedElement);
        });

        it('should not update if element does not exist', async () => {
            const initialElements = [
                { id: '1', name: 'Element 1', type: 'rectangle' },
                { id: '2', name: 'Element 2', type: 'circle' },
            ];
            elementService['elements'] = initialElements;

            const nonExistentElement = { id: '999', name: 'Non-existent Element', type: 'triangle' };

            await expect(elementService.updateElement(nonExistentElement)).rejects.toThrow('Element not found');

            expect(elementService.getElements()).not.toContainEqual(nonExistentElement);
            expect(mockElementRepository.saveElement).not.toHaveBeenCalled();
        });
    });

    describe('deleteElement', () => {
        it('should remove an element and delete it from the repository', async () => {
            const initialElements = [
                { id: '1', name: 'Element 1', type: 'rectangle' },
                { id: '2', name: 'Element 2', type: 'circle' },
            ];
            elementService['elements'] = initialElements;

            const elementIdToDelete = '1';
            mockElementRepository.deleteElement.mockResolvedValue();

            await elementService.deleteElement(elementIdToDelete);

            expect(elementService.getElements()).not.toContainEqual(initialElements[0]);
            expect(mockElementRepository.deleteElement).toHaveBeenCalledWith(elementIdToDelete);
        });

        it('should not delete if element does not exist', async () => {
            const initialElements = [
                { id: '1', name: 'Element 1', type: 'rectangle' },
                { id: '2', name: 'Element 2', type: 'circle' },
            ];
            elementService['elements'] = initialElements;

            const nonExistentElementId = '999';

            await expect(elementService.deleteElement(nonExistentElementId)).rejects.toThrow('Element not found');

            expect(elementService.getElements()).toEqual(initialElements);
            expect(mockElementRepository.deleteElement).not.toHaveBeenCalled();
        });
    });
});