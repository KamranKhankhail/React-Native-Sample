import React, { useState } from 'react'
import {
  Image, Text, TouchableOpacity, ViewPropTypes
} from 'react-native'
import PropTypes from 'prop-types'
import { moderateScale } from 'react-native-size-matters'
import styles from './styles'
import { AppStyles } from '../../themes'
import RadioButton from '../RadioButton/RadioButton'
import { CustomButton } from '../index'
import { getReqDetails, getReqTitle } from '../../utils/sharedUtils'
import { FRIEND_STATUSES } from '../../constants/constants'
import PlaceholderItem from '../PlaceholderItem'
import I18n from '../../I18n'
import { logToConsole } from '../../utils/logUtils'

function ViewContactItem (props) {
  const {
    item = {}, onPress, loading, loggedInUser = {}, isRadioVisible = false, onPressContact, friendId, onDeleteRequest, fetching
  } = props
  const { picture, name, id: contactId, friend } = item
  const { id: loggedInUserId = '' } = loggedInUser || {}
  const { id: requestFriendId = '', status, sender: requestSender = loggedInUserId } = friend || {}

  const activeOpacity = typeof onPress === 'function' ? 1 : 0.2
  const contactIcon = picture ? { uri: picture } : AppStyles.iconSet.profileFilled

  const isNotSelf = loggedInUserId !== contactId
  const isSender = loggedInUserId === requestSender

  const onPressRequest = () => {

    if (!status || status === FRIEND_STATUSES.DELETED) {
      onPress(contactId)
    } else if (status === FRIEND_STATUSES.PENDING || status === FRIEND_STATUSES.FRIEND) {
      onDeleteRequest(requestFriendId, contactId)
    }
  }

  if (fetching) {
    return <PlaceholderItem/>
  }

  const { title, isHollow } = getReqDetails(status)

  return (
    <TouchableOpacity
      onPress={() => onPressContact(item)}
      style={styles.itemContainer}
      activeOpacity={activeOpacity}
    >
      <Image
        source={contactIcon}
        style={styles.imageContainer}
        defaultSource={AppStyles.iconSet.profileFilled}
      />
      <Text style={[styles.nameStyle, props.nameStyle]}>{name}</Text>
      {isRadioVisible && (
        <RadioButton
          isActive={props.isRadio}
          circleStyle={styles.radioStyle}
          size={moderateScale(37)}
          color={AppStyles.colorSet.pinkI}
        />
      )}
      {!isRadioVisible && isNotSelf && (
        <CustomButton
          size="small"
          hollow={isHollow}
          onPress={onPressRequest}
          container={styles.followButtonContainer}
          loadingIndicatorColor={AppStyles.colorSet.pink}
          isLoading={(loading && String(friendId) === String(contactId))}
          title={I18n.t(title)}
          backgroundColor={AppStyles.colorSet.purple}
        />
      )}
    </TouchableOpacity>
  )
}

export default ViewContactItem

ViewContactItem.propTypes = {
  item: PropTypes.object,
  loggedInUser: PropTypes.object,
  isRadioVisible: PropTypes.bool,
  isRadio: PropTypes.bool,
  nameStyle: ViewPropTypes.style,
  onPressContact: PropTypes.func,
}

ViewContactItem.defaultProps = {
  item: {},
  loggedInUser: {},
  isRadioVisible: false,
  isRadio: false,
  nameStyle: {},
  onPressContact: () => {}
}
