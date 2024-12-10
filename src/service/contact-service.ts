import { Contact, User } from "@prisma/client";
import {
  ContactResponse,
  CreateContactRequest,
  toContactResponse,
  UpdateContactRequest,
} from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { prismaClient } from "../application/database";
import { HTTPException } from "hono/http-exception";

export class ContactService {
  static async create(
    user: User,
    request: CreateContactRequest
  ): Promise<ContactResponse> {
    request = ContactValidation.CREATE.parse(request);

    let data = {
      ...request,
      ...{ username: user.username },
    };

    const contact = await prismaClient.contact.create({
      data: data,
    });

    return toContactResponse(contact);
  }

  static async get(user: User, contactId: number): Promise<ContactResponse> {
    contactId = ContactValidation.GET.parse(contactId);

    const contact = await this.contactMustExist(user, contactId);

    return toContactResponse(contact);
  }

  static async contactMustExist(
    user: User,
    contactId: number
  ): Promise<Contact> {
    const contact = await prismaClient.contact.findFirst({
      where: {
        id: contactId,
        username: user.username,
      },
    });

    if (!contact) {
      throw new HTTPException(404, {
        message: "Contact not found",
      });
    }

    return contact;
  }

  static async update(
    user: User,
    request: UpdateContactRequest
  ): Promise<ContactResponse> {
    request = ContactValidation.UPDATE.parse(request);

    let contact = await this.contactMustExist(user, request.id);
    contact = await prismaClient.contact.update({
      where: {
        id: contact.id,
      },
      data: request,
    });

    return toContactResponse(contact);
  }

  static async delete(user: User, contactId: number): Promise<boolean> {
    contactId = ContactValidation.DELETE.parse(contactId);

    const contact = await this.contactMustExist(user, contactId);

    await prismaClient.contact.delete({
      where: {
        username: user.username,
        id: contact.id,
      },
    });

    return true;
  }
}
