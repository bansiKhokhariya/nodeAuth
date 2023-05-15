const asyncHandler = require('express-async-handler')
const Contact = require('../models/contactModel')


// get all contact //
const getContact = asyncHandler(async (req, res) => {

    // searching data //
    var search = '';
    if (req.query.search) {
        search = req.query.search;
    }

    // pagination data //
    var page = 1;
    if (req.query.page) {
        page = parseInt(req.query.page)
    }

    var pageSize = 2;
    if (req.query.pageSize) {
        pageSize = parseInt(req.query.pageSize)
    }

    // Calculate skip value based on pagination settings
    const skip = (page - 1) * pageSize;

    const contacts = await Contact.find({
        user_id: req.user._id,
        completed: req.query.completed ? req.query.completed : 'true',
        $or: [
            {name: {$regex: '.*' + search + '.*'}},
            {email: {$regex: '.*' + search + '.*'}},
            {phone: {$regex: '.*' + search + '.*'}},
        ]
    }).sort({_id: -1}).limit(pageSize).skip(skip).exec();

    const contactCounts = await Contact.find({
        user_id: req.user._id,
        completed: req.query.completed ? req.query.completed : 'true',
        $or: [
            {name: {$regex: '.*' + search + '.*'}},
            {email: {$regex: '.*' + search + '.*'}},
            {phone: {$regex: '.*' + search + '.*'}},
        ]
    }).countDocuments();


    // Calculate the total number of pages
    const totalPages = Math.ceil(contactCounts / pageSize);

    // next page //
    const nextPage = (totalPages === page) ? null : page + 1;

    // previous page //
    const previousPage = (page !== 1) ? page - 1 : null;

    res.status(200).json({
        data: contacts,
        totalPages: totalPages,
        currentPage: page,
        nextPage: nextPage,
        previousPage: previousPage
    });

})

// create contact //
const createContact = asyncHandler(async (req, res) => {

    const {name, email, phone, completed} = req.body;

    if (!name || !email || !phone) {
        res.status(400);
        throw new Error('All fields are mandatory');
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user._id,
        completed
    })

    res.status(200).json(contact);
})

// get id contact //
const getContactById = asyncHandler(async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        res.status(200).json(contact);
    } catch (err) {
        res.status(404);
        throw new Error('Contact not found');
    }

})

// update contact //
const updateContact = asyncHandler(async (req, res) => {

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if (contact.user_id.toString() !== req.user._id) {
        res.status(403);
        throw new Error("User don't have permission to update other user contacts");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );

    res.status(200).json(updatedContact);

})

// delete contact //
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    if (contact.user_id.toString() !== req.user._id) {
        res.status(403);
        throw new Error("User don't have permission to update other user contacts");
    }
    await Contact.deleteOne({_id: req.params.id});
    res.status(200).json(contact);
})


module.exports = {getContact, createContact, getContactById, updateContact, deleteContact};