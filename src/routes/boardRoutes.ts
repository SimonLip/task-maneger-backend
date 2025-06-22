import express, { Request, Response } from "express";
import Board from "../models/Board";
import Card from "../models/Card";

const router = express.Router();

router.get("/boards", async (req: Request, res: Response) => {
  try {
    const boards = await Board.find();
    res.json(boards);
    return;
  } catch (error) {
    res.status(500).json({ message: "Error fetching boards" });
    return;
  }
});

router.post("/boards", async (req: Request, res: Response) => {
  try {
    const { _id, name } = req.body;

    const board = new Board({ _id, name });
    await board.save();
    res.json(board);
    return;
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Board with this ID already exists" });
    } else {
      res.status(500).json({ message: "Error creating board" });
    }
    return;
  }
});


router.get("/boards/:id/cards", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cards = await Card.find({ boardId: id });
    res.json(cards);
    return;
  } catch (error) {
    res.status(500).json({ message: "Error fetching cards" });
    return;
  }
});

router.post("/cards", async (req: Request, res: Response) => {
  try {
    const { boardId, title, description, status, order } = req.body;

    if (!["todo", "inprogress", "done"].includes(status)) {
      res.status(400).json({ message: "Invalid status value" });
      return;
    }

    const card = new Card({ boardId, title, description, status, order });
    await card.save();
    res.json(card);
    return;
  } catch (error) {
    res.status(500).json({ message: "Error creating card" });
    return;
  }
});

router.put("/cards/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, title, description, order } = req.body;

    if (status && !["todo", "inprogress", "done"].includes(status)) {
      res.status(400).json({ message: "Invalid status value" });
      return;
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (typeof order === "number") updateData.order = order;

    const updatedCard = await Card.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedCard) {
      res.status(404).json({ message: "Card not found" });
      return;
    }

    res.json(updatedCard);
    return;
  } catch (error) {
    res.status(500).json({ message: "Error updating card" });
    return;
  }
});

router.delete("/cards/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Card.findByIdAndDelete(id);
    res.json({ message: "Card deleted" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error deleting card" });
    return;
  }
});

router.get("/boards/:id", async (req: Request, res: Response) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      res.status(404).json({ message: "Board not found" });
      return;
    }

    const cards = await Card.find({ boardId: board._id });
    res.json({ ...board.toObject(), cards });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error fetching board" });
    return;
  }
});

router.delete('/boards', async (req, res) => {
  try {
    await Board.deleteMany({});
    await Card.deleteMany({});
    res.json({ message: 'All boards and cards deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting boards and cards' });
  }
});

export default router;
