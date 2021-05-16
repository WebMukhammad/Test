import newsletter from './newsletter.api'
import auth from './auth.api'
import product from './product.api'
import category from './category.api'
import brand from './brand.api'
import order from './order.api'
import bill from './bill.api'
import company from './company.api'
import notification from './notification.api'

const mapBindMethods = (context, methods) => {
  const obj = {}
  Object.keys(methods).forEach((key) => {
    obj[key] = methods[key].bind(context)
  })
  return obj
}

export default (context) => ({
  newsletter: mapBindMethods(context, newsletter),
  auth: mapBindMethods(context, auth),
  product: mapBindMethods(context, product),
  category: mapBindMethods(context, category),
  brand: mapBindMethods(context, brand),
  order: mapBindMethods(context, order),
  bill: mapBindMethods(context, bill),
  company: mapBindMethods(context, company),
  notification: mapBindMethods(context, notification)
})
