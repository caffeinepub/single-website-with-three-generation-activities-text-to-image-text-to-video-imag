import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Array "mo:core/Array";
import List "mo:core/List";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type BuildActivity = {
    id : Text;
    prompt : Text;
    artifactUri : ?Text;
    timestamp : Time.Time;
  };

  module BuildActivity {
    public func compare(activity1 : BuildActivity, activity2 : BuildActivity) : Order.Order {
      Int.compare(activity1.timestamp : Int, activity2.timestamp : Int);
    };
  };

  public type BuildHistory = List.List<BuildActivity>;

  let userBuildHistories = Map.empty<Principal, BuildHistory>();

  public shared ({ caller }) func recordBuild(prompt : Text, artifactUri : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can record builds");
    };

    let history = switch (userBuildHistories.get(caller)) {
      case (null) { List.empty<BuildActivity>() };
      case (?existing) { existing };
    };

    let activity : BuildActivity = {
      id = switch (artifactUri) {
        case (null) { "" };
        case (?uri) { uri };
      };
      timestamp = Time.now();
      artifactUri;
      prompt;
    };

    history.add(activity);
    userBuildHistories.add(caller, history);
  };

  public query ({ caller }) func getBuildHistory(user : Principal) : async [BuildActivity] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Viewing build history requires authentication");
    };

    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own build history");
    };

    switch (userBuildHistories.get(user)) {
      case (null) { [] };
      case (?history) { history.toArray().sort().reverse() };
    };
  };
};
