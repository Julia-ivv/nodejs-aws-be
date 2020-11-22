import Joi from 'joi';

export function isValid(title, description, price, image, count) {

    const schema = Joi.object({
        title: Joi.string().alphanum().required(),
        description: Joi.string().alphanum().required(),
        price: Joi.number().required(),
        image: Joi.string()
        .regex(/^https?:\/\/(www\.)?(((\d{1,3}\.){3}\d{1,3})|([А-ЯЁа-яё0-9][0-9А-ЯЁа-яё\-.]*\.[А-ЯЁа-яё]+|[a-zA-Z0-9][a-zA-Z0-9\-.]*\.[a-zA-Z]+))(:[1-9]\d{1,4})?\/?([-0-9/a-zA-Z&=?+%._]+#?)?$/),
        count: Joi.number().required()
    });

    const { error } = schema.validate({ title, description, price, image, count });
    if (!error) return true
    else return false;
}