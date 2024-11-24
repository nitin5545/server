import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  id: string;
  title: string;
  icon: string;
  isFolder: boolean;
  parentId: string | null;
  order: number;
  items?: IItem[];
  isOpen?: boolean;
}

const ItemSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  icon: { type: String, required: true },
  isFolder: { type: Boolean, required: true },
  parentId: { type: String, default: null },
  order: { type: Number, required: true },
  items: [{ type: String }],
  isOpen: { type: Boolean },
});

export default mongoose.model<IItem>('Item', ItemSchema);