import React from 'react';
import {
  Image, Text, TouchableOpacity, ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';
import { moderateScale } from 'react-native-size-matters';
import styles from './styles';
import { AppStyles, Images } from '../../themes';
import RadioButton from '../RadioButton/RadioButton';
import { CustomButton } from '../index';
import { getReqTitle } from '../../utils/sharedUtils';
import { FRIEND_STATUSES } from '../../constants/constants';
import PlaceholderItem from '../PlaceholderItem';

function ViewContactItem(props) {
  const {
    item = {}, onPress, loading, loggedInUser = {}, isRadioVisible = false, onPressContact, friendId, onDeleteRequest, fetching
  } = props;
  const {
    imageUrl, name, id: contactId, friend
  } = item;
  const { id: loggedInUserId = '' } = loggedInUser || {};
  const { id: requestFriendId = '', status, sender: requestSender = loggedInUserId } = friend || {};
  const activeOpacity = typeof onPress === 'function' ? 1 : 0.2;
  const contactIcon = imageUrl ? { uri: imageUrl } : Images.defaultUser;

  const isNotSelf = loggedInUserId !== contactId;
  const isSender = loggedInUserId === requestSender;
  const isNotFriend = status !== FRIEND_STATUSES.FRIEND;

  const onPressRequest = () => {
    if (!status || status === FRIEND_STATUSES.DELETED) {
      onPress(contactId);
    } else if (status === FRIEND_STATUSES.PENDING) {
      onDeleteRequest(requestFriendId);
    }
  };

  if (fetching) {
    return <PlaceholderItem />;
  }

  return (
    <TouchableOpacity
      onPress={() => onPressContact(item)}
      style={styles.itemContainer}
      activeOpacity={activeOpacity}
    >
      <Image
        source={contactIcon}
        style={styles.imageContainer}
        defaultSource={Images.defaultUser}
      />
      <Text style={[styles.nameStyle, props.nameStyle]}>{ name }</Text>
      { isRadioVisible && (
      <RadioButton
        isActive={props.isRadio}
        circleStyle={styles.radioStyle}
        size={moderateScale(37)}
        color={AppStyles.colorSet.pinkI}
      />
      )}
      {!isRadioVisible && isNotSelf && isNotFriend && isSender && (
      <CustomButton
        size="small"
        hollow={!!friend && status !== FRIEND_STATUSES.DELETED}
        onPress={onPressRequest}
        loadingIndicatorColor={AppStyles.colorSet.pink}
        isLoading={(loading && String(friendId) === String(contactId))}
        title={getReqTitle(status)}
        backgroundColor={AppStyles.colorSet.purple}
      />
      ) }
    </TouchableOpacity>
  );
}

export default ViewContactItem;

ViewContactItem.propTypes = {
  item: PropTypes.object,
  loggedInUser: PropTypes.object,
  isRadioVisible: PropTypes.bool,
  isRadio: PropTypes.bool,
  nameStyle: ViewPropTypes.style,
  onPressContact: PropTypes.func,
};

ViewContactItem.defaultProps = {
  item: {},
  loggedInUser: {},
  isRadioVisible: false,
  isRadio: false,
  nameStyle: {},
  onPressContact: () => {}
};
