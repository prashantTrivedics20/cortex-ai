import proxy from "express-http-proxy";

export const proxyWithUser =
(serviceUrl)=>{

 return proxy(
  serviceUrl,
  {

   proxyReqOptDecorator:
   (proxyReqOpts, srcReq)=>{

    if(srcReq.user){

      proxyReqOpts.headers[
       "x-user-id"
      ] =
      srcReq.user.userId;

      proxyReqOpts.headers[
       "x-user-email"
      ] =
      srcReq.user.email;
      proxyReqOpts.headers[
       "x-user-avatar"
      ] =
      srcReq.user.avatar

    }

    return proxyReqOpts;

   },

   proxyErrorHandler: (err, res, next) => {
    console.error('Proxy error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Service unavailable'
    });
   }

  }
 );

}