import { ElementRepository, Element } from '../domain/element';
import { v4 as uuidv4 } from 'uuid';

export class ElementService {
    private elements: Element[] = [];
    constructor(private elementRepository: ElementRepository) { }

    async initialize(): Promise<void> {
        await this.elementRepository.initialize();
        this.elements = await this.elementRepository.loadInitialState();
    }

    getElements(): Element[] {
        return this.elements;
    }

    async createElement(element: Element): Promise<void> {
        this.elements.push(element);
        await this.elementRepository.saveElement(element);
    }

    async updateElement(element: Element): Promise<void> {
        this.elements = this.elements.map((el) => (el.id === element.id ? element : el));
        await this.elementRepository.saveElement(element);
    }

    async deleteElement(elementId: string): Promise<void> {
        this.elements = this.elements.filter((el) => el.id !== elementId);
        await this.elementRepository.deleteElement(elementId);
    }
}

export interface ElementDTO {
    id: string;
}