import e from 'express';

export enum ReactType {
  Love = 'Love',
  Like = 'Like',
  Haha = 'Haha',
  Wow = 'Wow',
  Sad = 'Sad',
  Angry = 'Angry',
  Care = 'Care',
}

export enum AttachmentType {
  Image = 'Image',
  Video = 'Video',
  Document = 'Document',
}

export enum PostMode {
  Privacy = 'Privacy',
  Public = 'Public',
  OnlyMe = 'OnlyMe',
  Friends = 'Friends',
  FriendsOfFriends = 'FriendsOfFriends',
}
