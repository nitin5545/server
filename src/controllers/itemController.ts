import { Request, Response } from 'express';
import Item, { IItem } from '../models/Item';
import { io } from '../index';

export const getItems = async (req: Request, res: Response) => {
  try {
    const items = await Item.find().sort('order');
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
  }
};

export const createItem = async (req: Request, res: Response) => {
  try {
    const { title, icon, isFolder, parentId, order } = req.body;

    if (!title || typeof isFolder !== 'boolean') {
      return res.status(400).json({ message: 'Invalid input 1' });
    }

    const newItem = new Item({
      id: Date.now().toString(),
      title,
      icon,
      isFolder,
      parentId,
      order,
    });

    await newItem.save();
    io.emit('itemCreated', newItem);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(400).json({ message: 'Error creating item' });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const { title, icon, isFolder, parentId, order, isOpen } = req.body;

    if (!title || typeof isFolder !== 'boolean') {
      return res.status(400).json({ message: 'Invalid input 3' });
    }

    const updatedItem = await Item.findOneAndUpdate(
      { id: req.params.id },
      { title, icon, isFolder, parentId, order, isOpen },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    io.emit('itemUpdated', updatedItem);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(400).json({ message: 'Error updating item' });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const deletedItem = await Item.findOneAndDelete({ id: req.params.id });

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    io.emit('itemDeleted', req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(400).json({ message: 'Error deleting item' });
  }
};

export const updateItems = async (req: Request, res: Response) => {
  try {
    const items: IItem[] = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Invalid input 2' });
    }

    for (const item of items) {
      await Item.findOneAndUpdate(
        { id: item.id },
        { order: item.order, parentId: item.parentId, items: item.items?.map(i => i.id) }
      );
    }

    io.emit('itemsReordered', items);
    res.status(200).send();
  } catch (error) {
    console.error('Error reordering items:', error);
    res.status(400).json({ message: 'Error reordering items' });
  }
};