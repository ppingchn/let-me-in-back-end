const createError = require('../util/createError');
const fs = require('fs');
const cloudinary = require('../util/cloundinary');
const {
  Post,
  LikePost,
  LikeComment,
  PostPicture,
  Comment,
  User,
  Reply,
  Notification,
  sequelize,
  UserDetail,
  CompanyDetail,
} = require('../models');
const { post } = require('../routes/registerRoute');
const FriendService = require('../service/friendsService');

exports.createPost = async (req, res, next) => {
  try {
    let result;
    await sequelize.transaction(async (t) => {
      const { detail } = req.body;

      let postId;

      if (!detail) {
        createError('detail is required', 400);
      }
      if (!req.user) {
        createError('you have no permission', 403);
      }
      if (detail || postPicArr) {
        const post = await Post.create({
          detail,
          userId: req.user.id,
        });
        postId = post.id;
        result = post;
      }

      if (req.files) {
        for (let pic of req.files) {
          const result = await cloudinary.upload(pic.path);

          await PostPicture.create({
            postPic: result.secure_url,

            postId,
          });
        }
      }
      await Notification.create({ PostId: postId, userId: req.user.id });
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  } finally {
    if (req.files?.postPicArr) {
      fs.unlinkSync(req.files.postPicArr[0].path);
    }
  }
};
exports.updatePost = async (req, res, next) => {
  try {
    console.log(req.user.id);

    const result = await sequelize.transaction(async (t) => {
      const { postId } = req.params;
      const { detail, postPicIdArray } = req.body;
      const { postPicArray } = req.files;
      // console.log(postPicArray);

      const picArray = [];
      // console.log('*************');

      // for (let i = 0; i < postPicArray.length; i++) {
      //   // console.log(JSON.parse(postPicIdArray)[i]);
      //   // console.log('-------------');
      //   // console.log(postPicArray[i]);
      //   if (JSON.parse(postPicIdArray)[i]) {
      //     picArray.push({
      //       id: JSON.parse(postPicIdArray)[i],
      //       file: postPicArray[i].path,
      //     });
      //   } else {
      //     picArray.push({ file: postPicArray[i].path });
      //   }
      // }

      if (!detail) {
        createError('detail is required', 400);
      }

      const post = await Post.findOne({ where: { id: postId } });
      if (!post) {
        createError('post not found', 404);
      }
      if (post.userId !== req.user.id) {
        createError('you have no permission', 403);
      }

      if (detail) {
        post.detail = detail;
      }
      await post.save();

      //find id postPic
      picArray.map(async (el, idx) => {
        if (el.id) {
          let findPic = await PostPicture.findOne({ where: { id: el.id } });

          if (findPic) {
            await cloudinary.destroy(findPic.postPic);
            const result = await cloudinary.upload(el.file);
            findPic.postPic = result.secure_url;
            await findPic.save();
          } else {
            createError('Post pic is not found');
          }
        } else {
          const result = await cloudinary.upload(el.file);
          await PostPicture.create({
            postPic: result.secure_url,
            postId,
          });
        }
      });
    });
    res.json({ post });
  } catch (err) {
    next(err);
  }
  if (req.files?.postPic) {
    fs.unlinkSync(req.files.postPic[0].path);
  }
};
exports.deletePost = async (req, res, next) => {
  console.log('hahah');
  let t;
  try {
    t = await sequelize.transaction();
    const { postId } = req.params;

    const post = await Post.findOne({ where: { id: postId } });
    // const postPic = await PostPicture.fineOne({ where: { id: postPicId } });
    if (!post) {
      createError('post not found', 400);
    }
    if (post.userId !== req.user.id) {
      createError('you have no permission', 403);
    }
    //delete all post
    if (post) {
      await Comment.destroy({ where: { postId: postId } }, { transaction: t });
      await LikePost.destroy({ where: { postId: postId } }, { transaction: t });
      await Post.destroy({ where: { id: postId } }, { transaction: t });
      await PostPicture.destroy({ where: { postId } }, { transaction: t });
    }
    //delete detail
    // if (post.detail) {
    //   await Post.destroy({ where: detail }, { transaction: t });
    // }

    // //postPic

    // if (!postPic) {
    //   createError('post not found', 404);
    // }
    // if (!postId) {
    //   createError('you have permission', 403);
    // }
    // if (postPic) {
    //   await PostPicture.destroy(
    //     { where: { id: postPicId }, postId },
    //     { transaction: t },
    //   );
    // }
    await t.commit();
    res.status(204).json();
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.getUserPost = async (req, res, next) => {
  try {
    const userId = await FriendService.findFriendId(req.user.id);
    userId.push(req.user.id);

    // SELECT * FROM posts WHERE userId IN (myId, friendId1, friendId2, friendId3, ...)
    const posts = await Post.findAll({
      where: { userId: userId }, // WHERE userId IN (1,2,3) => WHERE userId = 1 OR userId = 2 OR userId = 3
      order: [['createdAt', 'DESC']],
      attributes: {
        exclude: ['userId'],
      },
      include: [
        { model: PostPicture },
        {
          model: User,
          attributes: {
            exclude: [
              'password',
              'email',
              'phoneNumber',
              'coverPhoto',
              'country',
              'houseNumber',
              'subDistrict',
              'district',
              'province',
              'postCode',
              'location',
              'createdAt',
            ],
          },
          include: [{ model: UserDetail }, { model: CompanyDetail }],
        },
        {
          model: Comment,
          attributes: {
            exclude: ['createdAt', 'userId'],
          },
          include: [
            {
              model: Reply,
              include: [
                {
                  model: User,
                  attributes: {
                    exclude: [
                      'password',
                      'email',
                      'phoneNumber',
                      'coverPhoto',
                      'country',
                      'houseNumber',
                      'subDistrict',
                      'district',
                      'province',
                      'postCode',
                      'location',
                      'createdAt',
                    ],
                  },
                  include: [{ model: UserDetail }, { model: CompanyDetail }],
                },
              ],
            },
            {
              model: User,
              attributes: {
                exclude: [
                  'password',
                  'email',
                  'phoneNumber',
                  'coverPhoto',
                  'country',
                  'houseNumber',
                  'subDistrict',
                  'district',
                  'province',
                  'postCode',
                  'location',
                  'createdAt',
                ],
              },
              include: [{ model: UserDetail }, { model: CompanyDetail }],
            },
            {
              model: LikeComment,
              attributes: {
                exclude: ['createdAt'],
              },
              include: {
                model: User,
                attributes: {
                  exclude: [
                    'password',
                    'email',
                    'phoneNumber',
                    'coverPhoto',
                    'createdAt',
                    'country',
                    'houseNumber',
                    'subDistrict',
                    'district',
                    'province',
                    'postCode',
                    'location',
                  ],
                },
                include: [{ model: UserDetail }, { model: CompanyDetail }],
              },
            },
          ],
        },
        {
          model: LikePost,
          attributes: {
            exclude: ['createdAt'],
          },
          include: {
            model: User,
            attributes: {
              exclude: [
                'password',
                'email',
                'phoneNumber',
                'coverPhoto',
                'createdAt',
                'country',
                'houseNumber',
                'subDistrict',
                'district',
                'province',
                'postCode',
                'location',
              ],
            },
            include: [{ model: UserDetail }, { model: CompanyDetail }],
          },
        },
      ],
    });
    res.json({ posts });
  } catch (err) {
    next(err);
  }
};

exports.getUserPostByPage = async (req, res, next) => {
  try {
    const userId = await FriendService.findFriendId(req.user.id);
    userId.push(req.user.id);
    const { page, limit } = req.query;
    const offset = +page * limit;
    console.log(page, limit, offset);

    // SELECT * FROM posts WHERE userId IN (myId, friendId1, friendId2, friendId3, ...)
    const posts = await Post.findAll({
      where: { userId: userId }, // WHERE userId IN (1,2,3) => WHERE userId = 1 OR userId = 2 OR userId = 3
      order: [['createdAt', 'DESC']],
      attributes: {
        exclude: ['userId'],
      },
      include: [
        { model: PostPicture },
        {
          model: User,
          attributes: {
            exclude: [
              'password',
              'email',
              'phoneNumber',
              'coverPhoto',
              'country',
              'houseNumber',
              'subDistrict',
              'district',
              'province',
              'postCode',
              'location',
              'createdAt',
            ],
          },
          include: [{ model: UserDetail }, { model: CompanyDetail }],
        },
        {
          model: Comment,
          attributes: {
            exclude: ['createdAt', 'userId'],
          },
          include: [
            {
              model: Reply,
              include: [
                {
                  model: User,
                  attributes: {
                    exclude: [
                      'password',
                      'email',
                      'phoneNumber',
                      'coverPhoto',
                      'country',
                      'houseNumber',
                      'subDistrict',
                      'district',
                      'province',
                      'postCode',
                      'location',
                      'createdAt',
                    ],
                  },
                  include: [{ model: UserDetail }, { model: CompanyDetail }],
                },
              ],
            },
            {
              model: User,
              attributes: {
                exclude: [
                  'password',
                  'email',
                  'phoneNumber',
                  'coverPhoto',
                  'country',
                  'houseNumber',
                  'subDistrict',
                  'district',
                  'province',
                  'postCode',
                  'location',
                  'createdAt',
                ],
              },
              include: [{ model: UserDetail }, { model: CompanyDetail }],
            },
            {
              model: LikeComment,
              attributes: {
                exclude: ['createdAt'],
              },
              include: {
                model: User,
                attributes: {
                  exclude: [
                    'password',
                    'email',
                    'phoneNumber',
                    'coverPhoto',
                    'createdAt',
                    'country',
                    'houseNumber',
                    'subDistrict',
                    'district',
                    'province',
                    'postCode',
                    'location',
                  ],
                },
                include: [{ model: UserDetail }, { model: CompanyDetail }],
              },
            },
          ],
        },
        {
          model: LikePost,
          attributes: {
            exclude: ['createdAt'],
          },
          include: {
            model: User,
            attributes: {
              exclude: [
                'password',
                'email',
                'phoneNumber',
                'coverPhoto',
                'createdAt',
                'country',
                'houseNumber',
                'subDistrict',
                'district',
                'province',
                'postCode',
                'location',
              ],
            },
            include: [{ model: UserDetail }, { model: CompanyDetail }],
          },
        },
      ],
      offset: +offset,
      limit: +limit,
    });

    const nextPage = +page + 1;

    res.json({ posts, nextPage });
  } catch (err) {
    next(err);
  }
};

// exports.getUserPost = async (req, res, next) => {
//   try {
//     const userId = await FriendService.findFriendId(req.user.id);
//     userId.push(req.user.id);

//     // SELECT * FROM posts WHERE userId IN (myId, friendId1, friendId2, friendId3, ...)
//     const posts = await Post.findAll({
//       where: { userId: userId }, // WHERE userId IN (1,2,3) => WHERE userId = 1 OR userId = 2 OR userId = 3
//       order: [['createdAt', 'DESC']],
//       attributes: {
//         exclude: ['userId'],
//       },
//       include: [
//         { model: PostPicture },
//         {
//           model: User,
//           attributes: {
//             exclude: [
//               'password',
//               'email',
//               'phoneNumber',
//               'coverPhoto',
//               'country',
//               'houseNumber',
//               'subDistrict',
//               'district',
//               'province',
//               'postCode',
//               'location',
//               'createdAt',
//             ],
//           },
//           include: [{ model: UserDetail }, { model: CompanyDetail }],
//         },
//         {
//           model: Comment,
//           attributes: {
//             exclude: ['createdAt', 'userId'],
//           },
//           include: [
//             {
//               model: Reply,
//               include: [
//                 {
//                   model: User,
//                   attributes: {
//                     exclude: [
//                       'password',
//                       'email',
//                       'phoneNumber',
//                       'coverPhoto',
//                       'country',
//                       'houseNumber',
//                       'subDistrict',
//                       'district',
//                       'province',
//                       'postCode',
//                       'location',
//                       'createdAt',
//                     ],
//                   },
//                 },
//               ],
//             },
//             {
//               model: User,
//               attributes: {
//                 exclude: [
//                   'password',
//                   'email',
//                   'phoneNumber',
//                   'coverPhoto',
//                   'country',
//                   'houseNumber',
//                   'subDistrict',
//                   'district',
//                   'province',
//                   'postCode',
//                   'location',
//                   'createdAt',
//                 ],
//               },
//             },
//             {
//               model: LikeComment,
//               attributes: {
//                 exclude: ['createdAt'],
//               },
//               include: {
//                 model: User,
//                 attributes: {
//                   exclude: [
//                     'password',
//                     'email',
//                     'phoneNumber',
//                     'coverPhoto',
//                     'createdAt',
//                     'country',
//                     'houseNumber',
//                     'subDistrict',
//                     'district',
//                     'province',
//                     'postCode',
//                     'location',
//                   ],
//                 },
//               },
//             },
//           ],
//         },
//         {
//           model: LikePost,
//           attributes: {
//             exclude: ['createdAt'],
//           },
//           include: {
//             model: User,
//             attributes: {
//               exclude: [
//                 'password',
//                 'email',
//                 'phoneNumber',
//                 'coverPhoto',
//                 'createdAt',
//                 'country',
//                 'houseNumber',
//                 'subDistrict',
//                 'district',
//                 'province',
//                 'postCode',
//                 'location',
//               ],
//             },
//           },
//         },
//       ],
//     });

//     res.json({ posts });
//   } catch (err) {
//     next(err);
//   }
// };
