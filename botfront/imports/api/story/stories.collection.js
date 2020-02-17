import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { checkIfCan } from '../../lib/scopes';
import { StorySchema } from './stories.schema';

export const Stories = new Mongo.Collection('stories');

// Deny all client-side updates on the Projects collection
Stories.deny({
    insert() {
        return true;
    },
    update() {
        return true;
    },
    remove() {
        return true;
    },
});

if (Meteor.isServer) {
    Meteor.publish('smartStories', function(projectId, query) {
        check(projectId, String);
        check(query, Object);
        checkIfCan('stories:r', projectId);
        return Stories.find({ projectId, ...query });
    });
    Meteor.publish('stories.inGroup', function(projectId, groupId) {
        check(groupId, String);
        check(projectId, String);
        checkIfCan('stories:r', projectId);
        return Stories.find({ projectId, storyGroupId: groupId });
    });

    Meteor.publish('stories.light', function(projectId) {
        check(projectId, String);
        checkIfCan('stories:r');
        return Stories.find({ projectId }, { fields: { title: true, checkpoints: true, storyGroupId: true } });
    });
    Meteor.publish('stories.events', function(projectId) {
        check(projectId, String);
        checkIfCan('responses:r');
        return Stories.find({ projectId }, { fields: { title: true, events: true } });
    });
}

Stories.attachSchema(StorySchema);
