import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getIO, getReceiverSocket } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // establish conversation
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);
    //implement socket.io for real time data transfer
    const receiverSocketId = getReceiverSocket(receiverId);

    if (receiverSocketId) {
      getIO().to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: [],
      });
    }

    return res.status(200).json({
      success: true,
      messages: conversation.messages,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getConversations = async (req, res) => {
  try {

    const userId = req.id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "username profilePicture")
      .populate({
        path: "messages",
        options: {
          sort: { createdAt: -1 },
          limit: 1,
        },
      })
      .sort({ updatedAt: -1 });

    const formattedConversations = conversations.map((conv) => {

      const otherUser = conv.participants.find(
        (p) => p._id.toString() !== userId.toString()
      );

      return {
        _id: conv._id,
        user: otherUser,
        lastMessage: conv.messages[0]?.message || "",
      };
    });

    return res.status(200).json({
      success: true,
      conversations: formattedConversations,
    });

  } catch (error) {
    console.log(error);
  }
};